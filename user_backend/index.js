import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "./middlewares/verify.middleware.js";
import { User, Project, Milestone } from "./models/user.model.js"
import Stripe from "stripe";

const app = express();
const PORT = 8000;
const JWT_SECRET = "1234";
const MONGO_URL = "mongodb+srv://anishsuman2305:dJ5i9XpBo8ZHatvi@cluster0.nocae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const saltRounds = 10
const stripe = Stripe('sk_test_51R5086GdIuM6VO5RFKcFxEcaIYkuwOnqRGVAUzhTutX6sSNSvUlI9kKDvzKLqdZhqtxN40gLxdUirCs96h6SJ4k200EMU8yipT')

mongoose.connect(MONGO_URL)
    .then(() => console.log("Database connected"))
    .catch(err => console.error("error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true }));

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password required" });

        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ username, password: hashedPassword, role });

        res.status(201).json({ message: "User created successfully", username: newUser.username, role });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password required" });

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(403).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("uuid", token, { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ message: "Login successful", username: user.username });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/", verify, (req, res) => {
    res.status(200).json({ user: req.user });
});

app.post("/connect-stripe", async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({username});
  
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  
    if (user.role !== "freelancer") {
      return res.status(403).json({ success: false, message: "Only freelancers can connect to Stripe" });
    }
    if (user.stripeAccountId) {
      return res.json({ 
        success: true, 
        message: "Already connected to Stripe", 
        stripeAccountId: user.stripeAccountId 
      });
    }
    const account = await stripe.accounts.create({ type: "express", capabilities: {
        transfers: { requested: true }
    } });
    user.stripeAccountId = account.id;
    await user.save();
  
    res.json({ success: true, stripeAccountId: account.id });
  });
  
  
  
app.post("/create-project", async (req, res) => {
    const { clientName, freelancerName, milestones } = req.body;
    
    const project = await Project.create({ clientId: clientName, freelancerId : freelancerName, totalAmount: 0 });
  
    for (let milestone of milestones) {
      await Milestone.create({
        projectId: project._id,
        description: milestone.description,
        amount: milestone.amount,
        status: "pending",
      });
    }
  
    res.json({ success: true, projectId: project._id });
  });
  
  app.post("/fund-escrow", async (req, res) => {
    const { projectId, amount, paymentMethodId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        payment_method: paymentMethodId,
        confirm: true,
        capture_method: "manual",
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
        },
    });
    await Milestone.updateMany(
        { projectId: projectId, status: "pending" },
        { $set: { paymentIntentId: paymentIntent.id } }
    );
    await Project.findByIdAndUpdate(projectId, { $inc: { totalAmount: amount } });

    res.json({ success: true, paymentIntentId: paymentIntent.id });
});
  
  app.post("/submit-milestone", async (req, res) => {
    const { milestoneId } = req.body;
  
    await Milestone.findByIdAndUpdate(milestoneId, { status: "submitted" });
  
    res.json({ success: true, message: "Milestone submitted" });
  });

  app.post("/release-payment", async (req, res) => {
    const { milestoneId } = req.body;
  
    const milestone = await Milestone.findById(milestoneId);
    const project = await Project.findById(milestone.projectId);
    const freelancer = await User.findOne({username : project.freelancerId});
    console.log(milestone)
    await stripe.paymentIntents.capture(milestone.paymentIntentId);
  
    await stripe.transfers.create({
      amount: milestone.amount * 100,
      currency: "usd",
      destination: freelancer.stripeAccountId,
    });
  
    await Milestone.findByIdAndUpdate(milestoneId, { status: "paid" });
  
    res.json({ success: true, message: "Payment released" });
  });
  

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

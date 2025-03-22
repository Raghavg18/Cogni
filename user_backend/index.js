import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "./middlewares/verify.middleware.js";
import { User, Project, Milestone } from "./models/user.model.js";
import Stripe from "stripe";

const app = express();
const PORT = 8000;
const JWT_SECRET = "1234";
const MONGO_URL =
  "mongodb+srv://anishsuman2305:dJ5i9XpBo8ZHatvi@cluster0.nocae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const saltRounds = 10;
const stripe = Stripe(
  "sk_test_51R5086GdIuM6VO5RFKcFxEcaIYkuwOnqRGVAUzhTutX6sSNSvUlI9kKDvzKLqdZhqtxN40gLxdUirCs96h6SJ4k200EMU8yipT"
);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password required" });

    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      username: newUser.username,
      role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("uuid", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res
      .status(200)
      .json({ message: "Login successful", username: user.username });
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
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.role !== "freelancer") {
    return res.status(403).json({
      success: false,
      message: "Only freelancers can connect to Stripe",
    });
  }
  
  try {
    if (user.stripeAccountId) {
      // Check if the account has transfers capability
      const account = await stripe.accounts.retrieve(user.stripeAccountId);
      
      if (account.capabilities && account.capabilities.transfers === "active") {
        return res.json({
          success: true,
          message: "Already connected to Stripe with transfers capability",
          stripeAccountId: user.stripeAccountId,
        });
      } else {
        // Create an account link for completing verification
        const accountLink = await stripe.accountLinks.create({
          account: user.stripeAccountId,
          refresh_url: `http://localhost:3000/stripe-refresh?username=${username}`,
          return_url: `http://localhost:3000/stripe-return?username=${username}`,
          type: 'account_onboarding',
        });
        
        return res.json({ 
          success: true, 
          message: "Account needs to complete transfers setup",
          accountLink: accountLink.url 
        });
      }
    }
    
    // Create a new account with transfers capability
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        transfers: { requested: true },
      },
    });
    
    user.stripeAccountId = account.id;
    await user.save();
    
    // Create an account link for the user to complete setup
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:3000/stripe-refresh?username=${username}`,
      return_url: `http://localhost:3000/onboarding`,
      type: 'account_onboarding',
    });
    
    res.json({ 
      success: true, 
      stripeAccountId: account.id,
      accountLink: accountLink.url
    });
  } catch (error) {
    console.error("Stripe connection error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to connect to Stripe",
      error: error.message 
    });
  }
});

app.post("/create-project", async (req, res) => {
  const { name, description, clientName, milestones } = req.body;

  const project = await Project.create({
    name,
    description,
    clientId: clientName,
    totalAmount: 0,
  });

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
  try {
    const { milestoneId } = req.body;

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    const project = await Project.findById(milestone.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const freelancer = await User.findOne({ username: project.freelancerId });
    if (!freelancer || !freelancer.stripeAccountId) {
      return res.status(404).json({
        success: false,
        message: "Freelancer Stripe account not found",
      });
    }
    
    // Capture the payment from the client first
    await stripe.paymentIntents.capture(milestone.paymentIntentId);
    
    // Check if the freelancer account has transfers capability
    const account = await stripe.accounts.retrieve(freelancer.stripeAccountId);
    
    if (!account.capabilities || account.capabilities.transfers !== "active") {
      // Create an account link for the freelancer to complete setup
      const accountLink = await stripe.accountLinks.create({
        account: freelancer.stripeAccountId,
        refresh_url: `http://localhost:3000/stripe-refresh?milestoneId=${milestoneId}`,
        return_url: `http://localhost:3000/stripe-return?milestoneId=${milestoneId}`,
        type: 'account_onboarding',
      });
      
      return res.status(400).json({
        success: false,
        message: "Freelancer needs to complete Stripe account setup before receiving payments",
        accountLink: accountLink.url
      });
    }
    
    // Now create the transfer
    const transfer = await stripe.transfers.create({
      amount: milestone.amount * 100,
      currency: "usd",
      destination: freelancer.stripeAccountId,
    });

    await Milestone.findByIdAndUpdate(milestoneId, {
      status: "paid",
      transferId: transfer.id,
    });

    res.json({
      success: true,
      message: "Payment released",
      transferId: transfer.id,
    });
  } catch (error) {
    console.error("Release payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to release payment",
      error: error.message 
    });
  }
});

// Get a specific project
app.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const milestones = await Milestone.find({projectId: project._id})
    res.status(200).json({project,milestones});
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get milestones for a project
app.get("/project/:projectId/milestones", async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.find({ projectId });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user info
app.get("/user/:username", verify, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove sensitive info
    const userInfo = {
      username: user.username,
      role: user.role,
      stripeAccountId: user.stripeAccountId,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all projects for a user
app.get("/projects", verify, async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let projects;
    if (user.role === "client") {
      projects = await Project.find({ clientId: username });
    } else {
      projects = await Project.find({ freelancerId: username });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/freelancers",async (req,res)=>{
  const freelancers = await User.find({role : "freelancer"})
  res.status(200).json(freelancers)
})

// Assign a freelancer to a project
app.put("/project/:projectId/assign-freelancer", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { freelancerId } = req.body;

    if (!projectId || !freelancerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Project ID and freelancer ID are required" 
      });
    }

    // Find the project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }

    // Verify the freelancer exists and is actually a freelancer
    const freelancer = await User.findOne({ 
      _id: freelancerId,
      role: "freelancer" 
    });

    if (!freelancer) {
      return res.status(404).json({ 
        success: false, 
        message: "Freelancer not found or user is not a freelancer" 
      });
    }

    // Update the project with the freelancer ID
    project.freelancerId = freelancer.username;
    await project.save();

    res.status(200).json({
      success: true,
      message: "Freelancer assigned successfully",
      project: {
        id: project._id,
        name: project.name,
        freelancerId: project.freelancerId
      }
    });
    
  } catch (error) {
    console.error("Error assigning freelancer:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Add a route to get details of a specific milestone
app.get("/milestone/:milestoneId", async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({ 
        success: false, 
        message: "Milestone not found" 
      });
    }

    res.json({
      success: true,
      milestone
    });
  } catch (error) {
    console.error("Error fetching milestone:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

app.get("/check-stripe-status/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user || !user.stripeAccountId) {
      return res.status(404).json({ 
        success: false, 
        message: "User or Stripe account not found" 
      });
    }
    
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    
    res.json({
      success: true,
      accountId: user.stripeAccountId,
      capabilities: account.capabilities,
      transfersEnabled: account.capabilities && account.capabilities.transfers === "active"
    });
  } catch (error) {
    console.error("Error checking Stripe status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check Stripe account status",
      error: error.message 
    });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("uuid");
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

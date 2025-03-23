import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "./middlewares/verify.middleware.js";
import { User, Project, Milestone } from "./models/user.model.js";
import Stripe from "stripe";
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 8000;
const JWT_SECRET = "1234";
const MONGO_URL =
  "mongodb+srv://anishsuman2305:dJ5i9XpBo8ZHatvi@cluster0.nocae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const saltRounds = 10;
const stripe = Stripe(
  "sk_test_51R5086GdIuM6VO5RFKcFxEcaIYkuwOnqRGVAUzhTutX6sSNSvUlI9kKDvzKLqdZhqtxN40gLxdUirCs96h6SJ4k200EMU8yipT"
);
const genAI = new GoogleGenerativeAI("AIzaSyC7SAkw_PDHTdnahWu0mnId8DZzIVIyhkg");

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

cloudinary.config({
  cloud_name: 'dyxsai3xf',
  api_key: '999174425217381',
  api_secret: 'XUbcCldIRmIFUj7xakQQEUT1HMI'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'milestones',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'gif'],
    transformation: [{ width: 1000, crop: "limit" }] // Optional: resize large images
  }
});

// Initialize multer with Cloudinary storage
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});


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

    const isPasswordCorrect = bcrypt.compare(password, user.password,);
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
      .json({ message: "Login successful", username: user.username, role: user.role });
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
  const { name, description, clientId, milestones, freelancerId } = req.body;

  const project = await Project.create({
    name,
    description,
    clientId,
    totalAmount: 0,
    freelancerId
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

  // Create and immediately capture the payment from client
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: true,
    // Remove capture_method: "manual" to charge immediately
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    description: `Escrow funding for Project: ${project.name}`,
  });
  
  await Milestone.updateMany(
    { projectId: projectId, status: "pending" },
    { $set: { paymentIntentId: paymentIntent.id } }
  );
  await Project.findByIdAndUpdate(projectId, { $inc: { totalAmount: amount } });

  res.json({ success: true, paymentIntentId: paymentIntent.id });
});

app.post("/submit-milestone", upload.array('images', 10), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files received:', req.files?.length || 0);
    
    const { milestoneId, repositoryUrl, hostingUrl, externalFiles, notes } = req.body;
    
    if (!milestoneId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing milestone ID" 
      });
    }
    
    // Extract Cloudinary URLs from uploaded files
    const imageUrls = req.files 
      ? req.files.map(file => file.path) 
      : [];
    
    console.log('Image URLs:', imageUrls);
    
    // Update the milestone in the database
    const updatedMilestone = await Milestone.findByIdAndUpdate(
      milestoneId, 
      {
        status: "submitted",
        repositoryUrl,
        hostingUrl,
        externalFiles,
        notes,
        images: imageUrls
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedMilestone) {
      return res.status(404).json({ 
        success: false, 
        message: "Milestone not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Milestone submitted successfully", 
      milestone: updatedMilestone 
    });
  } catch (error) {
    console.error("Error submitting milestone:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error submitting milestone", 
      error: error.message 
    });
  }
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

// Get all projects for a specific freelancer
app.get("/client-projects/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      return res.status(400).json({ 
        success: false, 
        message: "Client ID is required" 
      });
    }

    // Find all projects assigned to this freelancer
    const projects = await Project.find({ clientId });
    
    // For each project, get its milestones
    const projectsWithMilestones = await Promise.all(projects.map(async (project) => {
      const milestones = await Milestone.find({ projectId: project._id });
      
      // Calculate completion percentage based on milestones
      const totalMilestones = milestones.length;
      const completedMilestones = milestones.filter(
        m => m.status === "paid" || m.status === "submitted"
      ).length;
      
      const completionPercentage = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0;
      
      // Calculate total project value from milestones
      const totalAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
      
      return {
        id: project._id,
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        freelancerId: project.freelancerId,
        completed: completionPercentage,
        amount: totalAmount,
        createdAt: project.createdAt,
        milestones
      };
    }));
    
    res.status(200).json({
      success: true,
      projects: projectsWithMilestones
    });
  } catch (error) {
    console.error("Error fetching freelancer projects:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get all projects for a specific freelancer
app.get("/freelancer-projects/:freelancerId", async (req, res) => {
  try {
    const { freelancerId } = req.params;
    
    if (!freelancerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Freelancer ID is required" 
      });
    }

    // Find all projects assigned to this freelancer
    const projects = await Project.find({ freelancerId });
    
    // For each project, get its milestones
    const projectsWithDetails = await Promise.all(projects.map(async (project) => {
      const milestones = await Milestone.find({ projectId: project._id });
      
      // Calculate completion percentage based on milestones
      const totalMilestones = milestones.length;
      const completedMilestones = milestones.filter(
        m => m.status === "paid" || m.status === "submitted"
      ).length;
      
      const progress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0;
      
      // Calculate total budget and received amount
      const totalBudget = milestones.reduce((sum, m) => sum + m.amount, 0);
      const receivedAmount = milestones
        .filter(m => m.status === "paid")
        .reduce((sum, m) => sum + m.amount, 0);
      
      return {
        id: project._id.toString(),
        title: project.name,
        progress,
        totalBudget,
        receivedAmount,
        milestones: {
          total: totalMilestones,
          completed: completedMilestones
        }
      };
    }));
    
    res.status(200).json({
      success: true,
      projects: projectsWithDetails
    });
  } catch (error) {
    console.error("Error fetching freelancer projects:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Add this new route to your Express app
app.post("/generate-milestones", async (req, res) => {
  try {
    const { projectTitle, projectDescription, budget, timeframe } = req.body;
    
    if (!projectDescription) {
      return res.status(400).json({
        success: false,
        message: "Project description is required"
      });
    }

    // Create the prompt for Gemini
    const prompt = `
      As an experienced project manager, analyze this project and break it down into logical milestones.
      
      Project Title: ${projectTitle || "Untitled Project"}
      Project Description: ${projectDescription}
      ${budget ? `Total Budget: $${budget}` : ""}
      ${timeframe ? `Expected Timeframe: ${timeframe}` : ""}
      
      Create 3-6 milestone tasks that would allow this project to be completed efficiently.
      For each milestone, provide:
      1. A clear title
      2. A brief description of what should be delivered
      3. A reasonable estimated completion date (relative to project start, e.g., "+2 weeks")
      4. An appropriate portion of the total budget
      
      Format your response as a valid JSON array with objects containing these fields:
      [
        {
          "title": "Milestone 1 Title",
          "description": "Detailed description of deliverables",
          "timeEstimate": "+X weeks", 
          "amount": dollar amount (numeric, no $ symbol)
        },
        ...
      ]
    `;

    // Generate content with Gemini API using fetch
    const GEMINI_API_KEY = 'AIzaSyC7SAkw_PDHTdnahWu0mnId8DZzIVIyhkg'; // Get from environment variables
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse the response to get valid JSON
    // Find JSON content between square brackets
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (!jsonMatch) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate properly formatted milestones",
        rawResponse: text
      });
    }
    
    const milestones = JSON.parse(jsonMatch[0]);
    
    // Calculate dates based on relative timeframes
    const startDate = new Date();
    const processedMilestones = milestones.map(milestone => {
      // Process the timeEstimate (e.g., "+2 weeks")
      let dueDate = new Date(startDate);
      const timeEstimate = milestone.timeEstimate;
      
      if (timeEstimate) {
        const match = timeEstimate.match(/\+(\d+)\s+(day|days|week|weeks|month|months)/i);
        if (match) {
          const amount = parseInt(match[1]);
          const unit = match[2].toLowerCase();
          
          if (unit.startsWith('day')) {
            dueDate.setDate(dueDate.getDate() + amount);
          } else if (unit.startsWith('week')) {
            dueDate.setDate(dueDate.getDate() + (amount * 7));
          } else if (unit.startsWith('month')) {
            dueDate.setMonth(dueDate.getMonth() + amount);
          }
        }
      }
      
      return {
        ...milestone,
        date: dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        formattedDate: dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
    });
    
    // Calculate total budget
    const totalAmount = processedMilestones.reduce((sum, milestone) => sum + (parseFloat(milestone.amount) || 0), 0);
    
    res.json({
      success: true,
      milestones: processedMilestones,
      totalAmount
    });
    
  } catch (error) {
    console.error("Error generating milestones:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate milestones",
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

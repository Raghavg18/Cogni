import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "./middlewares/verify.middleware.js";
import User from "./models/user.model.js";

const app = express();
const PORT = 8000;
const JWT_SECRET = "1234";
const MONGO_URL = "mongodb+srv://anishsuman2305:dJ5i9XpBo8ZHatvi@cluster0.nocae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const saltRounds = 10

mongoose.connect(MONGO_URL)
    .then(() => console.log("Database connected"))
    .catch(err => console.error("error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true }));

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password required" });

        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: "User created successfully", username: newUser.username });
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

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

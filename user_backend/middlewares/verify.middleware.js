import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
const JWT_SECRET = "1234";

export const verify = async (req, res, next) => {
    try {
        const cookie = req.cookies.uuid;
        if (!cookie) {
            return res.status(401).json({ message: "No token found" });
        }

        const decoded = jwt.verify(cookie, JWT_SECRET);

        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

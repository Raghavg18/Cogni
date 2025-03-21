import { Schema, model } from "mongoose";

 const UserSchema = new Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["client", "freelancer"], required: true },
  stripeAccountId: String,
});

 const ProjectSchema = new Schema({
  clientId: String,
  freelancerId: String,
  totalAmount: Number,
  status: { type: String, enum: ["funded", "completed"], default: "funded" },
});

 const MilestoneSchema = new Schema({
  projectId: Schema.Types.ObjectId,
  description: String,
  amount: Number,
  status: { type: String, enum: ["pending", "approved", "paid"], default: "pending" },
  paymentIntentId: String,
});

export const User = model("User", UserSchema);
export const Project = model("Project", ProjectSchema);
export const Milestone = model("Milestone", MilestoneSchema);

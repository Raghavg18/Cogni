import mongoose from "mongoose";

const DisputeSchema = new mongoose.Schema({
  disputeTitle: String,
  disputeAmount: Number,
});

export const Dispute = mongoose.model("Dispute", DisputeSchema);

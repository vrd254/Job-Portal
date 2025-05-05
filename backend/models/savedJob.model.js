import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("SavedJob", savedJobSchema);

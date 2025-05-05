import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  salary: {
    type: Number,
    required: true
  },
  experienceLevel: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  industry: {
    type: String,
    required: true // 👈 Make this required if every job must have an industry
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }
  ],
  deadline: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);

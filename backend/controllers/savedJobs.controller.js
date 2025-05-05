import SavedJob from "../models/savedJob.model.js";

// ✅ Save a job for the current user
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    // Check if already saved
    const alreadySaved = await SavedJob.findOne({ user: userId, job: jobId });
    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    // Save the job
    const savedJob = await SavedJob.create({ user: userId, job: jobId });
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("❌ Save job error:", error);
    res.status(500).json({ message: "Failed to save job", error: error.message });
  }
};

// ✅ Get all saved jobs for the current user
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.id }).populate("job");
    const jobs = savedJobs.map((entry) => entry.job);
    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Get saved jobs error:", error);
    res.status(500).json({ message: "Failed to fetch saved jobs", error: error.message });
  }
};

// ✅ Unsave a job for the current user
export const unsaveJob = async (req, res) => {
  try {
    const result = await SavedJob.findOneAndDelete({ user: req.id, job: req.params.jobId });
    if (!result) {
      return res.status(404).json({ message: "Saved job not found" });
    }
    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("❌ Unsave job error:", error);
    res.status(500).json({ message: "Failed to unsave job", error: error.message });
  }
};

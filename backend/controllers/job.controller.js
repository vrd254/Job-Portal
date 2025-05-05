import { Job } from "../models/job.model.js";

// ==========================
// Admin: Post a new job
// ==========================
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      deadline,
      industry
    } = req.body;

    const userId = req.id;

    if (
      !title || !description || !requirements || !salary || !location ||
      !jobType || !experience || !position || !companyId || !industry
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map(item => item.trim()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      industry,
      created_by: userId,
      deadline: deadline ? new Date(deadline) : null
    });

    return res.status(201).json({
      message: "New job created successfully.",
      success: true,
      job
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while creating job.",
      success: false
    });
  }
};

// ==========================
// Admin: Update an existing job
// ==========================
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    // Update only the fields provided in the request body
    if (updates.title !== undefined) job.title = updates.title;
    if (updates.description !== undefined) job.description = updates.description;
    if (updates.requirements !== undefined) {
      job.requirements = typeof updates.requirements === 'string'
        ? updates.requirements.split(',').map(item => item.trim())
        : updates.requirements;
    }
    if (updates.salary !== undefined) job.salary = Number(updates.salary);
    if (updates.location !== undefined) job.location = updates.location;
    if (updates.jobType !== undefined) job.jobType = updates.jobType;
    if (updates.experience !== undefined) job.experienceLevel = Number(updates.experience);
    if (updates.position !== undefined) job.position = Number(updates.position);
    if (updates.deadline !== undefined) job.deadline = new Date(updates.deadline);
    if (updates.companyId !== undefined) job.company = updates.companyId;
    if (updates.industry !== undefined) job.industry = updates.industry;

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      success: true,
      job
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while updating job.",
      success: false
    });
  }
};

// ==========================
// Student: Get all jobs (with optional search)
// ==========================
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { industry: { $regex: keyword, $options: "i" } }
      ]
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Jobs fetched successfully.",
      success: true,
      jobs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching jobs.",
      success: false
    });
  }
};

// ==========================
// Student: Get job by ID (with full company details)
// ==========================
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("applications")
      .populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({
      message: "Job fetched successfully.",
      success: true,
      job
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching job.",
      success: false
    });
  }
};

// ==========================
// Admin: Get all jobs created by admin
// ==========================
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Admin jobs fetched successfully.",
      success: true,
      jobs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching admin jobs.",
      success: false
    });
  }
};

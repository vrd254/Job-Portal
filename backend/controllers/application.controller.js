import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate("company");
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (job.deadline && new Date(job.deadline) < new Date()) {
            return res.status(400).json({
                message: "Deadline has passed. You cannot apply for this job.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        const user = await User.findById(userId);

        if (user?.email) {
            const emailText = `Hi ${user.fullname},

You have successfully applied for the position: ${job.title} at ${job.company?.name}.

We will notify you regarding the application status.

Thank you for using our job portal!

Best regards,
Job Finder Team`;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Job Application Confirmation</h2>
                    <p>Hi <strong>${user.fullname}</strong>,</p>
                    <p>You have successfully applied for the position of <strong>${job.title}</strong> at <strong>${job.company?.name}</strong>.</p>
                    <p>We will notify you regarding the application status.</p>
                    <p>Thank you for using our job portal!</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>Job Finder Team 🚀</strong></p>
                </div>
            `;

            await sendEmail(
                user.email,
                "Job Application Confirmation",
                emailText,
                emailHtml
            );

            console.log(`✅ Confirmation email sent to ${user.email}`);
        }

        return res.status(201).json({
            message: "Job applied successfully. Confirmation email sent.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });

        if (!application || application.length === 0) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

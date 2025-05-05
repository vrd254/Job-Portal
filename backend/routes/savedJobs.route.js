import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // ✅ fixed import
import { saveJob, getSavedJobs, unsaveJob } from "../controllers/savedJobs.controller.js";

const router = express.Router();

router.post("/save/:jobId", isAuthenticated, saveJob);
router.get("/", isAuthenticated, getSavedJobs);
router.delete("/unsave/:jobId", isAuthenticated, unsaveJob);

export default router;

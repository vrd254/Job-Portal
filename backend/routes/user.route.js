import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword // ✅ New controller
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/forgot-password").post(forgotPassword); 
router.route("/reset-password/:token").put(resetPassword);

export default router;

import express from "express";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getMe, logout } from "../controllers/auth.controllers.js";

const router = express.Router();

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

// Get current user
router.get("/me",requireAuth, getMe);

// Logout
router.post("/logout",requireAuth,logout );

export default router;

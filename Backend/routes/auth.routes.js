import express from "express";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getMe, logout } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// Google OAuth routes
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    console.log("OAuth callback - Session ID:", req.sessionID)
  console.log(" OAuth callback - User:", req.user?.email)
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

// Get current user
authRouter.get("/me",requireAuth, getMe);

// Logout
authRouter.post("/logout",requireAuth,logout );

export default authRouter;

import express from "express";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getMe, logout } from "../controllers/auth.controllers.js";
import jwt from "jsonwebtoken"

const authRouter = express.Router();

// Google OAuth routes
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session : false }),
  (req, res) => {
    // Successful authentication
    const user = req.user; 
    const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWTSECRET_KEY, {expiresIn: "7d"})
      const cookiesOption = {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60*1000),
            secure : true,
            sameSite : "None",
            domain : ".vercel.app"
        }

        res.cookie("token", token , cookiesOption);
        
     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/auth/success?code=${token}`);
  }
);

// Get current user
authRouter.get("/me",requireAuth, getMe);

// Logout
authRouter.post("/logout",requireAuth,logout );

export default authRouter;

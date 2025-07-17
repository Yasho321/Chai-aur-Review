import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/courses.controllers.js";

const courseRouter = express.Router();

// Get all courses (admin) or assigned courses (user)
courseRouter.get("/", requireAuth, getCourses);

// Create course (admin only)
courseRouter.post("/", requireAuth, requireAdmin,createCourse );

// Update course (admin only)
courseRouter.put("/:id", requireAuth, requireAdmin,updateCourse );

// Delete course (admin only)
courseRouter.delete("/:id", requireAuth, requireAdmin,deleteCourse );

export default courseRouter;

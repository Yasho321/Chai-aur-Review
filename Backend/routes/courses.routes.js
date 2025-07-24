import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { createCourse, deleteCourse, enrollusers, getAllUsersOfCourse, getCourses, updateCourse } from "../controllers/courses.controllers.js";

const courseRouter = express.Router();

// Get all courses (admin) or assigned courses (user)
courseRouter.get("/", requireAuth, getCourses);

// Create course (admin only)
courseRouter.post("/", requireAuth, requireAdmin,createCourse );

// Update course (admin only)
courseRouter.put("/:id", requireAuth, requireAdmin,updateCourse );

// Delete course (admin only)
courseRouter.delete("/:id", requireAuth, requireAdmin,deleteCourse );

courseRouter.get("/:courseId/users",requireAuth,requireAdmin,getAllUsersOfCourse)

courseRouter.post("/:courseId/enrollusers",requireAuth,requireAdmin,enrollusers)

export default courseRouter;

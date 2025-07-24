import express from "express";

import upload from "../middlewares/upload.js";

import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { deleteMyFeedback, getAllFeedback, getMyFeedbackRecord, submitFeedback } from "../controllers/feedback.controllers.js";

const feedbackRouter = express.Router();

// Submit feedback
feedbackRouter.post("/", requireAuth, upload.array("mediaFiles", 10),submitFeedback );

// Admin: Get all feedback for a course
feedbackRouter.get("/course/:courseId", requireAuth, requireAdmin, getAllFeedback);

// User: Get own feedback
feedbackRouter.get("/my-feedback", requireAuth, getMyFeedbackRecord);

feedbackRouter.delete("/:feedbackId",requireAuth,deleteMyFeedback);

export default feedbackRouter;

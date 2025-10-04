import Feedback from "../models/feedback.models.js";
import PreRegisteredUser from "../models/preRegisteredUser.models.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const submitFeedback = async (req, res) => {
  try {
    const { courseId, textContent } = req.body;

    const preRegistered = await PreRegisteredUser.findOne({
      email: req.user.email,
      courseIds: courseId,
    });

    if (!preRegistered) {
      return res.status(403).json({ success : false ,  message: "Access denied to this course" });
    }

    const mediaFiles = [];

    for (const file of req.files || []) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "feedback-media",
        resource_type: "auto",
      });

      // Push uploaded file info
      mediaFiles.push({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileUrl: result.secure_url,
        fileSize: file.size,
        cloudinaryId: result.public_id,
      });

      // Safely delete local file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn("Failed to delete temp file:", file.path, err.message);
      }
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      courseId,
      textContent,
      mediaFiles,
    });

    
    return res.status(201).json({ success : true , message: "Feedback submitted successfully", feedback : feedback });
  } catch (error) {
    console.error("Error in feedback submission:", error);
    return res.status(500).json({ success : false , message: "Server error while posting feedback", error: error.message });
  }
}

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ courseId: req.params.courseId })
      .populate("userId", "name email")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success : true , message : "Feedbacks retrieved successfully", feedback: feedback });
  } catch (error) {
    return res.status(500).json({ success : false , message: "Server error while retrieving feedbacks", error: error.message });
  }
}

export const getMyFeedbackRecord = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success : true , message : "Feedbacks record retrieved successfully", feedback: feedback });
  } catch (error) {
    res.status(500).json({ success : false , message: "Server error while retrieving feedbacks record", error: error.message });
  }
}

export const deleteMyFeedback = async (req, res) => {
  try {
    const {feedbackId} = req.params;
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success : false , message: "Feedback not found"
        }); 
      }
    if(!feedback.userId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ success : false , message: "You are not authorized to delete this feedback" });
    }
    await feedback.deleteOne();

    return res.status(200).json({ success : true , message: "Feedback deleted successfully" });
    
  } catch (error) {
    console.error("Error in deleting feedback:", error);
    return res.status(500).json({ success : false , message: "Server error while deleting feedback", error: error.message });
    
  }
}


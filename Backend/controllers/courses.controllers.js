import Course from "../models/course.models.js";
import PreRegisteredUser from "../models/preRegisteredUser.models.js";

export const getCourses =  async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const courses = await Course.find({ isActive: true });
      return res.status(200).json({
        success : true,
        message: "Courses retrieved successfully",
        courses : courses});
    } else {
      const preRegistered = await PreRegisteredUser.findOne({
        email: req.user.email,
      }).populate("courseIds");

      return res.status(200).json({
        success: true,
        message: "Courses retrieved successfully",
        courses : preRegistered ? preRegistered.courseIds : []
      });
    }
  } catch (error) {
    return res.status(500).json({ success : false ,  message: "Server error while fetching courses", error: error.message });
  }
}

export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      adminId: req.user._id,
    });

    
    return res.status(201).json({
        success: true,
        message: "Course created successfully",
        course: course
    });
  } catch (error) {
    return res.status(500).json({ success : false ,  message: "Server error while creating course", error: error.message });
  }
}

export const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
         message: "Course not found" });
    }

    return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course: course
    });
  } catch (error) {
    return res.status(500).json({ success : false ,  message: "Server error while updating course", error: error.message });
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success : false ,  message: "Server error while deleting course", error: error.message });
  }
}
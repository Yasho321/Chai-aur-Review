import Course from "../models/course.models.js";
import Feedback from "../models/feedback.models.js";
import PreRegisteredUser from "../models/preRegisteredUser.models.js";
import User from "../models/user.models.js";

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

export const getAllUsersOfCourse = async (req, res) => {
  try {
    const {courseId} = req.params;
    const users = await Feedback.find({
      courseId: courseId,
    }).populate("userId");

    const usersWithFeedback = users.map((user) => user.userId);
    const feedbackUserIds = new Set(usersWithFeedback.map((u)=>u._id.toString()));

    const preReg = await PreRegisteredUser.find({courseIds : courseId});
    const preRegNotSigned = preReg.filter((pr)=>!pr.hasSignedUp).map((pr)=>({email : pr.email , createdAt : pr.createdAt}));

    const signedUpEmails= preReg.filter((pr)=>pr.hasSignedUp).map((pr)=>pr.email) ; 

    const signedUpUsers = await User.find({
      email: { $in: signedUpEmails }
    }).select("name email createdAt");

    const signedUpButNoFeedback = signedUpUsers.filter((su)=>!feedbackUserIds.has(su._id.toString()));






    return res.status(200).json({
       success: true,
        message: "Users of course fetched successfully", 
        data : {
          usersWithFeedback : usersWithFeedback ,
          signedUpButNoFeedback : signedUpButNoFeedback ,
          preRegisteredButNotSignedUp : preRegNotSigned ,
        } 
      });

    

    
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ success : false ,  message: "Server error while fetching users of course", error: error.message });
    
  }
}

export const enrollusers = async (req, res) => {
  try {
    const {courseId} = req.params;
    const {emails} = req.body;
    if(!Array.isArray(emails)){
      return res.status(400).json({success : false , message : "Invalid email list" , error : "Emails must be an array" });
    }
    const emailsArray = emails.map((email)=>email.trim().toLowerCase());
    const result = await PreRegisteredUser.updateMany({
      email: { $in: emailsArray },
    },{
       $addToSet: { courseIds: courseId } 
    })

    return res.status(200).json({
      success: true,
      message: "Users enrolled successfully",
      data: {
        result : result,
        usersAdded : result.modifiedCount 

      },
      });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success : false ,  message: "Server error while enrolling users", error: error.message });
    
  }

}
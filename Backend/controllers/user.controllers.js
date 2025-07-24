import Course from "../models/course.models.js";
import PreRegisteredUser from "../models/preRegisteredUser.models.js";
import csv from "csv-parser";
import { Readable } from "stream";
import User from "../models/user.models.js";

export const preRegisterUser = async (req, res) => {
  try {
    const { email, courseIds } = req.body;

    // Validate course IDs
    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ success : false,  message: "Some courses not found" });
    }

    const preRegistered = await PreRegisteredUser.create({
      email,
      courseIds,
      registeredBy: req.user._id,
    });

   
    res.status(201).json({ success : true , preRegisteredUser : preRegistered , message: "User pre-registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success : false , message: "User already pre-registered" });
    }
    res.status(500).json({ success : false , message: "Server error while pre registering user via form", error: error.message });
  }
}

export const preRegisterUserCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({success : false , message: "CSV file required" });
    }

    const results = [];
    const errors = [];
    let successfulResult = [];


    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          try {
            const { email, courseIds } = row;

            if (!email || !courseIds) {
              errors.push({ row: i + 1, error: "Missing email or courseIds" });
              continue;
            }

            const courseIdArray = courseIds.split(",").map((id) => id.trim());

            const preRegistered = await PreRegisteredUser.create({
              email: email.toLowerCase(),
              courseIds: courseIdArray,
              registeredBy: req.user._id,
            });

            successfulResult.push(preRegistered);
          } catch (error) {
            errors.push({ row: i + 1, error: error.message });
          }
        }

        return res.status(200).json({
            success : true ,
            successfulResults : successfulResult,
            message: `Processed ${results.length} rows`,
            successful: results.length - errors.length,
            errors,
        });
      });
  } catch (error) {
    res.status(500).json({ success : false , message: "Server error while pre registering user via csv", error: error.message });
  }
}

export const preRegisterUserJSON = async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({success : false , message: "Users must be an array" });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      try {
        const preRegistered = await PreRegisteredUser.create({
          email: userData.email.toLowerCase(),
          courseIds: userData.courseIds,
          registeredBy: req.user._id,
        });

        
        results.push({ preRegisterUser: preRegistered, status: "success" });
      } catch (error) {
        errors.push({ index: i, email: userData.email, error: error.message });
      }
    }

    return res.status(200).json({
        success : true ,
        message: `Processed ${users.length} users`,
        successful: results.length,
        results : results,
        errors : errors ,
    });
  } catch (error) {
    return res.status(500).json({success : false , message: "Server error while pre registering user via json", error: error.message });
  }
}

export const getPreRegisteredUser = async (req, res) => {
  try {
    const preRegistered = await PreRegisteredUser.find()
      .populate("courseIds", "title")
      .populate("registeredBy", "name email");

    return res.status(200).json({success : true , message : "Pre Registered Users fetched successfully" , preRegisteredUsers : preRegistered});
  } catch (error) {
    return res.status(500).json({ success : false , message: "Server error while fetching pre registered users", error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const {userId} = req.params;
    const preRegisteredUser = await PreRegisteredUser.findById(userId);
    if(!preRegisteredUser){
      return res.status(404).json({success : false , message: "User not found" });
    }

    if(preRegisteredUser.hasSignedUp){
      const user =await User.findOne({
        email: preRegisteredUser.email
      })

      await user.deleteOne();

    }

    await preRegisteredUser.deleteOne();

    return res.status(200).json({success : true , message: "User deleted successfully" });
    
    
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({success : false , message: "Server error while deleting user", error: error.message });
    
  }
}
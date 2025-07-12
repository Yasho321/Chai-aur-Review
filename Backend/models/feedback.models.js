import mongoose , {Schema} from "mongoose";

const feedbackSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    mediaFiles: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED"],
      default: "SUBMITTED",
    },

},{timestamps : true})

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback ;
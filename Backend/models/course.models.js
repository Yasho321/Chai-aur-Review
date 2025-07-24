import mongoose , {Schema} from "mongoose";

const courseSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }

},{timestamps : true })

const Course = mongoose.model("Course",courseSchema);

export default Course;
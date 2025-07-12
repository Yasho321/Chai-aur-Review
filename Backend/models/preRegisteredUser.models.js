import mongoose , {Schema} from "mongoose";

const preRegisteredUserSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    courseIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hasSignedUp: {
      type: Boolean,
      default: false,
    },
},{timestamps : true})

const PreRegisteredUser = mongoose.model("PreRegisteredUser", preRegisteredUserSchema);
export default PreRegisteredUser;
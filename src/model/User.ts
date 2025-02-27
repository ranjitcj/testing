import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  username: string;
  role: "student" | "app-user" | "admin" | "teacher";
  email: string;
  password: string;
  rollno: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  profilePicture: string;
  bannerImg: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
  education: {
    school: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number;
  }[];
  connections: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "app-user", "admin", "teacher"],
      default: "app-user",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    rollno: {
      type: String,
      default: "",
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code Expiry is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "App User",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

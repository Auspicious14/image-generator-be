/*import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, min: 3 },
    lastName: { type: String, required: true, min: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, min: 6 },
    manageOTP: {
      otp: { type: Number },
      otpDate: { type: Number },
    },
  },
  { timestamps: true }
);



export const userModel = mongoose.model("user", userSchema);
*/


import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, min: 3 },
    lastName: { type: String, required: true, min: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, min: 6 },
    manageOTP: {
      otp: { type: Number },
      otpDate: { type: Number },
    },
    generationCount: { type: Number, default: 0 }, 
    lastResetDate: { 
      type: Date, 
      default: () => new Date(new Date().setUTCHours(0, 0, 0, 0)) 
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    prompt: { type: String },
    imageUrl: { type: String },
    sessionId: { type: String },
  },
  { timestamps: true }
);

export const imageModel = mongoose.model("image", imageSchema);

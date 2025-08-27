import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    content: String,

    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);


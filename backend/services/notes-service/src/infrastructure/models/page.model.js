import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },

    title: { type: String, required: true },

    icon: { type: String },

    coverImage: { type: String },
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", pageSchema);

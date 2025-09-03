import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: { 
        type: String,  
        default: "New Page"
    },

    coverImage: { type: String },

    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
    },

    workspaceId: {
        type: String,
    },

    userId: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", pageSchema);

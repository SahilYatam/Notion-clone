import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["page", "paragraph", "todo", "heading", "image"],
      required: true,
    },

    content: mongoose.Schema.Types.Mixed, 

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      default: null,
    },

    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Block",
      },
    ],

    workspaceId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    isArchived: { 
        type: Boolean, 
        default: false 
    },
  },
  { timestamps: true }
);

export const Block = mongoose.model("Block", blockSchema);


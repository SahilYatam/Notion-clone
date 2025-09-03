import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["page", "paragraph", "todo"],
      required: true,
    },

    content:{ 
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    },

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


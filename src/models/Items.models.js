import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: {
        url: String,
        localpath: String,
      },
      default: {
        url: `https://placehold.co/600x400`,
        localpath: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

itemSchema.index({ createdBy: 1, name: 1 }, { unique: true });

export const Items = mongoose.model("Item", itemSchema);

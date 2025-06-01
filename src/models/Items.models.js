import mongoose from "mongoose";

const itemSchema = Schema({}, {});

export const Item = mongoose.model("Item", itemSchema);
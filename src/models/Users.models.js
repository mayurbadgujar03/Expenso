import mongoose from "mongoose";

const userSchema = Schema({}, {});

export const User = mongoose.model("User", userSchema);
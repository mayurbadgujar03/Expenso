import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { ApiError } from "../utils/api-error.js";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies?.token;

  try {
    if (!token) {
      throw new ApiError(400, "Authentication failed");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export default isLoggedIn;
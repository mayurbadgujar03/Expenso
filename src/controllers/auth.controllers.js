import { User } from "../models/Users.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (!username || !fullname || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exist");
    }

    const user = await User.create({
      username,
      fullname,
      email,
      password,
    });
    if (!user) {
      throw new ApiError(400, "Network error - User not created");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { message: "User stored successfully" }));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "User not stored successfully"));
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    const cookieOptions = {
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, { token }, "User logged-in successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Login failed"));
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json(new ApiResponse(200, "LoggedOut the user"));
};

export { registerUser, loginUser, logoutUser };

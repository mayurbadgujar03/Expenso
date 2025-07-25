import { User } from "../models/Users.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (!username || !fullname || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "All fields (username, fullname, email, password) are required",
        ),
      );
  }
  try {
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      throw new ApiError(400, "User already exists with this email");
    }
    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      throw new ApiError(400, "User already exists with this username");
    }

    const user = await User.create({
      username,
      fullname,
      email,
      password,
    });
    if (!user) {
      throw new ApiError(
        500,
        "User creation failed due to network/database issue",
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, { userId: user._id }, "User stored successfully"),
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "All fields (email and password) are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await user.isPasswordCorrect(password);
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
          },
        },
        "User logged-in successfully",
      ),
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
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

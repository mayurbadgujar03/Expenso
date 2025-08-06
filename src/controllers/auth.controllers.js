import { PrismaClient } from "@prisma/client";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { sendMagicLinkEmail } from "../utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

dotenv.config();

const signupMagicLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "Email is required"));
  }
  try {
    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserEmail) {
      throw new ApiError(400, "User already exists with this email");
    }

    const user = await prisma.user.create({
      data: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(
        500,
        "User creation failed due to network/database issue",
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = addMinutes(new Date(), 10);

    await prisma.user.update({
      where: { email },
      data: {
        magicToken: token,
        magicTokenExpiry: expiry,
      },
    });

    const magicLink = `${process.env.BASE_URL}/api/v1/dashboard/${token}`;

    await sendMagicLinkEmail(user.email, magicLink);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { userId: user.id },
          `Signup link sent to ${user.email}. Expires in 10 minutes.`,
        ),
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const signinMagicLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "Email is required"));
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new ApiError(400, "User doesn't exists with this email");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = addMinutes(new Date(), 10);

    await prisma.user.update({
      where: { email },
      data: {
        magicToken: token,
        magicTokenExpiry: expiry,
      },
    });

    const magicLink = `${process.env.BASE_URL}/api/v1/dashboard/${token}`;

    await sendMagicLinkEmail(user.email, magicLink);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { userId: user.id },
          `Login link sent to ${user.email}. Expires in 10 minutes.`,
        ),
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const refreshAccessToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json(new ApiError(401, "No refresh token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (
      !user ||
      user.refreshToken !== token ||
      user.refreshTokenExpiry < new Date()
    ) {
      throw new ApiError(403, "Refresh token is invalid or expired");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const accessCookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 12 * 60 * 60 * 1000,
      sameSite: "Strict",
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
        refreshTokenExpiry: addDays(new Date(), 7),
      },
    });

    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json(new ApiResponse(201, null, `Tokens refreshed`));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const logoutUser = async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json(new ApiResponse(200, "LoggedOut the user"));
};

export { signupMagicLink, signinMagicLink, refreshAccessToken, logoutUser };

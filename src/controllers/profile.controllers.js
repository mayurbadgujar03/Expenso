import { User } from "../models/Users.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const profile = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized access");
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile loaded successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Profile not loaded"));
  }
};

export default profile;

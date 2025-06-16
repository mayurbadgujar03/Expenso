import { User } from "../models/Users.models.js";
import { Purchase } from "../models/Purchases.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const history = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const now = new Date();
    const startingOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endingOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const purchases = await Purchase.find({
      createdBy: user._id,
      createdAt: {
        $gte: startingOfMonth,
        $lte: endingOfMonth,
      },
    }).populate("item");

    return res
      .status(200)
      .json(new ApiResponse(200, purchases, "History loaded successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Purchase not done yet"));
  }
};

export default history;

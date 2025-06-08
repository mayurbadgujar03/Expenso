import { User } from "../models/Users.models.js";
import { Purchase } from "../models/Purchases.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const history = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const purchases = await Purchase.find({ createdBy: user._id }).populate(
      "item",
    );

    return res
      .status(200)
      .json(new ApiResponse(200, purchases, "History loaded successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Purchase not done properly"));
  }
};

export default history;

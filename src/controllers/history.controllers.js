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

    const purchases = await Purchase.find().populate("item");

    return res
      .status(201)
      .json(new ApiResponse(201, purchases, "History loaded successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Purchase not done properly"));
  }
};

export default history;

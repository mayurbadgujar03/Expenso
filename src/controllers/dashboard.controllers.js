import { User } from "../models/Users.models.js";
import { Items } from "../models/Items.models.js";

import { ApiError } from "../utils/api-error.js";

const createItem = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const item = await Items.create({
      createdBy: user._id,
      name,
      price,
      image,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Item stored successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to add item"));
  }
};

export { createItem };

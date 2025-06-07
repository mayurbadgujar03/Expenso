import { User } from "../models/Users.models.js";
import { Items } from "../models/Items.models.js";
import { Purchase } from "../models/Purchases.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const createItem = async (req, res) => {
  let { name, price, image } = req.body;

  if (!name || !price || !image) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const normalizedName = name.toLowerCase().trim();

    const existingItem = await Items.findOne({
      createdBy: user._id,
      name: normalizedName,
    });
    if (existingItem) {
      throw new ApiError(400, "Item already exist");
    }

    const item = await Items.create({
      createdBy: user._id,
      name: normalizedName,
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

const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const items = await Items.find({ createdBy: user._id });

    return res
      .status(200)
      .json(new ApiResponse(200, items, "Dashboard loaded"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to load dashboard"));
  }
};

const confirm = async (req, res) => {
  const { quantity, total_price, item_id } = req.body;

  if (!quantity || !total_price || !item_id) {
    throw new ApiError(401, "Data not passed correctly");
  }
  if (quantity <= 0) {
    throw new ApiError(401, "Nagtive data is not allowed");
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const item = await Items.findById(item_id);
    if (item.price * quantity !== total_price) {
      console.warn("Price mismatch detected for user:", user.fullname);
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `"Price mismatch detected for user:", ${user.fullname}`,
          ),
        );
    }

    const purchase = await Purchase.create({
      createdBy: user._id,
      item: item._id,
      quantity,
      total_price,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, purchase, "Purchased successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Purchase not done properly"));
  }
};

export { createItem, dashboard, confirm };

import { User } from "../models/Users.models.js";
import { Items } from "../models/Items.models.js";
import { Purchase } from "../models/Purchases.models.js";
import { PrismaClient } from "@prisma/client";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const prisma = new PrismaClient();

const createItem = async (req, res) => {
  let { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const normalizedName = name.toLowerCase().trim();

    const existingDeletedItem = await prisma.item.findFirst({
      where: {
        createdById: user.id,
        name: normalizedName,
        deleted: true,
      },
    });

    const existingItem = await prisma.item.findFirst({
      where: {
        createdById: user.id,
        name: normalizedName,
      },
    });
    if (existingDeletedItem) {
      const restoredItem = await prisma.item.update({
        where: { id: existingDeletedItem.id },
        data: {
          deleted: false,
        },
      });
      return res
        .status(201)
        .json(new ApiResponse(201, restoredItem, "Item stored successfully"));
    }
    if (existingItem) {
      throw new ApiError(400, "Item with this name already exists");
    }

    if (typeof image === "string") {
      image = {
        url: image,
        localpath: "",
      };
    }

    const item = await prisma.item.create({
      data: {
        createdBy: {
          connect: { id: user.id },
        },
        name: normalizedName,
        price: parseFloat(price),
        imageUrl: image.url,
        imageLocalPath: image.localpath,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, item, "Item stored successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Failed to add item"));
  }
};

const dashboard = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullname: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

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
    const startingOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endingOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const items = await prisma.item.findMany({
      where: {
        createdById: user.id,
        deleted: false,
      },
    });

    const monthlyPurchasedItems = await prisma.purchase.findMany({
      where: {
        createdById: user.id,
        createdAt: {
          gte: startingOfMonth,
          lte: endingOfMonth,
        },
      },
    });

    let monthlyTotal = 0;
    monthlyPurchasedItems.forEach((purchasedItem) => {
      monthlyTotal += purchasedItem.total_price;
    });

    const dailyPurchasedItems = await prisma.purchase.findMany({
      where: {
        createdById: user.id,
        createdAt: {
          gte: startingOfDay,
          lte: endingOfDay,
        },
      },
    });

    let dailyTotal = 0;
    dailyPurchasedItems.forEach((purchasedItem) => {
      dailyTotal += purchasedItem.total_price;
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { items, monthlyTotal, dailyTotal },
          "Dashboard loaded",
        ),
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Failed to load dashboard"));
  }
};

const confirm = async (req, res) => {
  const { quantity, total_price, item_id } = req.body;

  if (!quantity || !total_price || !item_id) {
    return res.status(400).json(new ApiError(400, "Data not passed correctly"));
  }
  if (quantity <= 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Negative data is not allowed"));
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
        .status(400)
        .json(
          new ApiError(
            400,
            `Price mismatch detected for user: ${user.fullname}`,
          ),
        );
    }

    const purchase = await Purchase.create({
      createdBy: user._id,
      item: item._id,
      currentPrice: item.price,
      quantity,
      total_price,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, purchase, "Purchased successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Purchase not done properly"));
  }
};

const updatePrice = async (req, res) => {
  const { price } = req.body;
  const { item_id } = req.params;

  if (!price || !item_id) {
    return res.status(400).json(new ApiError(400, "Data not passed correctly"));
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const item = await Items.findById(item_id);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    item.price = price;
    await item.save();

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Price updated successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Price not changed properly"));
  }
};

const deleteItem = async (req, res) => {
  const { item_id } = req.params;

  if (!item_id) {
    return res.status(400).json(new ApiError(400, "Data not passed correctly"));
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Session expired, please login again");
    }

    const item = await Items.findById(item_id);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    item.deleted = true;
    await item.save();

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Item deleted successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    console.error("Unexpected error:", error);
    return res.status(500).json(new ApiError(500, "Not deleted properly"));
  }
};

export { createItem, dashboard, confirm, updatePrice, deleteItem };

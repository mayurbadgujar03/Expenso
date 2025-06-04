import { User } from "../models/Users.models.js";
import { ApiError } from "../utils/api-error.js";

const createItem = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(400, "Cookie expried");
    }
  } catch (error) {}
};

export { createItem };

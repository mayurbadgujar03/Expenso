import { ApiError } from "../utils/api-error.js";
import { User } from "../models/Users.models.js";
import { ApiResponse } from "../utils/api-response.js";

const registerUser = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (!username || !fullname || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      throw new ApiError(400, "User already exist");
    }

    const user = await User.create({
      username,
      fullname,
      email,
      password,
    });

    if (!user) {
      throw new ApiError(400, "Network error - User not created");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { message: "User stored successfully" }));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "User not stored successfully"));
  }
};
export { registerUser };

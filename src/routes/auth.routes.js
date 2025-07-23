import { Router } from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/auth.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/auth.validators.js";

const router = Router();

router.route("/register").post(userRegistrationValidator(), validate, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isLoggedIn, logoutUser);

export default router;

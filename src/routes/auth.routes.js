import { Router } from "express";

import {
  signupMagicLink,
  signinMagicLink,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controllers.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/auth.validators.js";

const router = Router();
router
  .route("/sign-up")
  .post(userRegistrationValidator(), validate, signupMagicLink);
router.route("/sign-in").post(userRegistrationValidator(), validate, signinMagicLink);
router.route("/refreshToken").get(refreshAccessToken);
router.route("/logout").post(isLoggedIn, logoutUser);

export default router;

import { Router } from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;

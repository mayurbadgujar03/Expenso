import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import profile from "../controllers/profile.controllers.js";

const router = Router();

router.route("/profile").get(isLoggedIn, profile);

export default router;

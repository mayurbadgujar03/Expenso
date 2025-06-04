import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import { createItem } from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/create").post(isLoggedIn, createItem);

export default router;
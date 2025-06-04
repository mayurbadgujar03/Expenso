import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import { createItem, dashboard } from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/create").post(isLoggedIn, createItem);
router.route("/dashboard").post(isLoggedIn, dashboard);

export default router;
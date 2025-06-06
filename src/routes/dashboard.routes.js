import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  createItem,
  dashboard,
  confirm,
} from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/items/create").post(isLoggedIn, createItem);
router.route("/dashboard").post(isLoggedIn, dashboard);
router.route("/dashboard/purchase/confirm").post(isLoggedIn, confirm);

export default router;

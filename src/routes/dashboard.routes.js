import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  createItem,
  dashboard,
  confirm,
  updatePrice,
} from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/items/create").post(isLoggedIn, createItem);
router.route("/").get(isLoggedIn, dashboard);
router.route("/dashboard/purchase/confirm").post(isLoggedIn, confirm);
router.route("/dashboard/update-price/:item_id").put(isLoggedIn, updatePrice);

export default router;

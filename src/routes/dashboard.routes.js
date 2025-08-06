import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  createItem,
  dashboard,
  confirm,
  updatePrice,
  deleteItem,
} from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/dashboard/item/create").post(isLoggedIn, createItem);
router.route("/dashboard/:token").get(dashboard);
router.route("/dashboard/purchase/confirm").post(isLoggedIn, confirm);
router.route("/dashboard/update-price/:item_id").put(isLoggedIn, updatePrice);
router.route("/dashboard/delete-item/:item_id").delete(isLoggedIn, deleteItem);

export default router;

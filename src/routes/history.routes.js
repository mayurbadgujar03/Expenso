import { Router } from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import history from "../controllers/history.controllers.js";

const router = Router();

router.route("/history").get(isLoggedIn, history);

export default router;

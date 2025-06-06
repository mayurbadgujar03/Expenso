import { Router } from "express";

import profile from "../controllers/profile.controllers.js";

const router = Router();

router.route("/profile").get(profile);

export default router;

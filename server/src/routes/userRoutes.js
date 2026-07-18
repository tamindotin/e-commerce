import { Router } from "express";

import { getProfile } from "../controller/userController.js";
import auth from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiterMiddleware.js";

const router = Router();

router.get("/", apiLimiter, auth, getProfile);

export default router;

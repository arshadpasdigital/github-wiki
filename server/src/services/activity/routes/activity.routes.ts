import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth-middleware";
import dependencies from "@/services/activity/dependencies/activity.dependencies";

const router = Router();
const { activityController } = dependencies.controller;

router.get("/", authMiddleware, activityController.getRecent);

export default router;

import { Router } from "express";
import dependencies from "../dependencies/session.dependencies";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";

const router = Router();

const { controller } = dependencies;
const sessionController = controller.sessionController;

router.get("/", authMiddleware, sessionController.getSessions);
router.get("/:id", authMiddleware, sessionController.getSessionById);
router.post("/", authMiddleware, sessionController.createSession);
router.patch("/:id", authMiddleware, sessionController.updateSession);
router.delete("/:id", authMiddleware, sessionController.deleteSession);

export default router;

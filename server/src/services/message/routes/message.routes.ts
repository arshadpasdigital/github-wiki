import { Router } from "express";
import dependencies from "../dependencies/message.dependencies";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";

const router = Router();

const { controller } = dependencies;
const messageController = controller.messageController;

router.get("/", authMiddleware, messageController.getMessages);
router.get("/:id", authMiddleware, messageController.getMessageById);
router.post("/", authMiddleware, messageController.createMessage);
router.patch("/:id", authMiddleware, messageController.updateMessage);
router.delete("/:id", authMiddleware, messageController.deleteMessage);

export default router;

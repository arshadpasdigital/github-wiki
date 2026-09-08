import asyncHandler from "@/shared/middlewares/async-handler";
import AppError from "@/shared/utils/app-error";
import {
    createMessageSchema,
    updateMessageSchema,
} from "../validation/message.validation";
import { MessageService } from "../services/message.service";
import { ApiResponse } from "@/shared/utils/api-response";

const getMessageId = (value: string | string[] | undefined): string => {
    if (typeof value !== "string" || value.length === 0) {
        throw new AppError("Message id is required", 400);
    }
    return value;
};

export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    readonly getMessages = asyncHandler(async (req, res) => {
        const sessionId =
            typeof req.query.sessionId === "string" ? req.query.sessionId : undefined;
        const messages = await this.messageService.getMessages(sessionId);
        res.status(200).json(ApiResponse.success(messages, 200, "get messages"));
    });

    readonly getMessageById = asyncHandler(async (req, res) => {
        const message = await this.messageService.getMessageById(getMessageId(req.params.id));
        res.status(200).json(ApiResponse.success(message, 200, "get message"));
    });

    readonly createMessage = asyncHandler(async (req, res) => {
        const input = createMessageSchema.parse(req.body);
        const message = await this.messageService.createMessage(input);
        res.status(201).json(ApiResponse.success(message, 201, "create message"));
    });

    readonly updateMessage = asyncHandler(async (req, res) => {
        const input = updateMessageSchema.parse(req.body);
        const message = await this.messageService.updateMessage(
            getMessageId(req.params.id),
            input,
        );
        res.status(200).json(ApiResponse.success(message, 200, "update message"));
    });

    readonly deleteMessage = asyncHandler(async (req, res) => {
        const message = await this.messageService.deleteMessage(getMessageId(req.params.id));
        res.status(200).json(ApiResponse.success(message, 200, "message deleted"));
    });
}

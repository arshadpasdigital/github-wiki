import { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import type { ChatMessageDocument } from "@/shared/models/chat-messages.model";
import type {
    CreateMessageInput,
    UpdateMessageInput,
} from "../validation/message.validation";
import {
    MessageRepository,
    type MessageRepositoryContract,
} from "../repositories/message.repository";

export class MessageService {
    constructor(
        private readonly messageRepository: MessageRepositoryContract = new MessageRepository(),
    ) {}

    async getMessages(sessionId?: string): Promise<ChatMessageDocument[]> {
        const filter = sessionId ? { sessionId } : {};
        return this.messageRepository.findAll(filter);
    }

    async getMessageById(id: string): Promise<ChatMessageDocument> {
        this.validateId(id);
        const message = await this.messageRepository.findById(id);
        if (!message) throw new AppError("Message not found", 404);
        return message;
    }

    async createMessage(input: CreateMessageInput): Promise<ChatMessageDocument> {
        this.validateSessionId(input.sessionId);
        return this.messageRepository.create(input);
    }

    async updateMessage(id: string, input: UpdateMessageInput): Promise<ChatMessageDocument> {
        this.validateId(id);
        const message = await this.messageRepository.updateById(id, input);
        if (!message) throw new AppError("Message not found", 404);
        return message;
    }

    async deleteMessage(id: string): Promise<ChatMessageDocument> {
        this.validateId(id);
        const message = await this.messageRepository.deleteById(id);
        if (!message) throw new AppError("Message not found", 404);
        return message;
    }

    private validateId(id: string): void {
        if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid message id", 400);
    }

    private validateSessionId(sessionId: string): void {
        if (!Types.ObjectId.isValid(sessionId)) throw new AppError("Invalid session id", 400);
    }
}

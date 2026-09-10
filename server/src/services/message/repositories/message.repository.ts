import { Types } from "mongoose";
import {
    ChatMessageModel,
    type ChatMessageDocument,
} from "@/shared/models/chat-messages.model";
import type {
    CreateMessageInput,
    UpdateMessageInput,
} from "../validation/message.validation";

export interface MessageRepositoryContract {
    findAll(filter?: Record<string, any>): Promise<ChatMessageDocument[]>;
    findById(id: string): Promise<ChatMessageDocument | null>;
    create(input: CreateMessageInput): Promise<ChatMessageDocument>;
    updateById(id: string, input: UpdateMessageInput): Promise<ChatMessageDocument | null>;
    deleteById(id: string): Promise<ChatMessageDocument | null>;
}

export class MessageRepository implements MessageRepositoryContract {
    async findAll(filter: Record<string, any> = {}): Promise<ChatMessageDocument[]> {
        return ChatMessageModel.find(filter).sort({ createdAt: 1 }).exec();
    }

    async findById(id: string): Promise<ChatMessageDocument | null> {
        return ChatMessageModel.findById(id).exec();
    }

    async create(input: CreateMessageInput): Promise<ChatMessageDocument> {
        return ChatMessageModel.create({
            ...input,
            sessionId: new Types.ObjectId(input.sessionId),
        });
    };

    async updateById(
        id: string,
        input: UpdateMessageInput,
    ): Promise<ChatMessageDocument | null> {
        return ChatMessageModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<ChatMessageDocument | null> {
        return ChatMessageModel.findByIdAndDelete(id).exec();
    }
}

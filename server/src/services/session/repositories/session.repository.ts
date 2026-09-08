import { Types } from "mongoose";
import {
    ChatSessionModel,
    type ChatSessionDocument,
} from "@/shared/models/chat-sessions.model";
import type {
    CreateSessionInput,
    UpdateSessionInput,
} from "../validation/session.validation";

export interface SessionRepositoryContract {
    findAll(filter?: Record<string, any>): Promise<ChatSessionDocument[]>;
    findById(id: string): Promise<ChatSessionDocument | null>;
    create(input: CreateSessionInput): Promise<ChatSessionDocument>;
    updateById(id: string, input: UpdateSessionInput): Promise<ChatSessionDocument | null>;
    deleteById(id: string): Promise<ChatSessionDocument | null>;
}

export class SessionRepository implements SessionRepositoryContract {
    async findAll(filter: Record<string, any> = {}): Promise<ChatSessionDocument[]> {
        return ChatSessionModel.find(filter)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .exec();
    }

    async findById(id: string): Promise<ChatSessionDocument | null> {
        return ChatSessionModel.findById(id).exec();
    }

    async create(input: CreateSessionInput): Promise<ChatSessionDocument> {
        return ChatSessionModel.create({
            ...input,
            repoId: new Types.ObjectId(input.repoId),
            userId: new Types.ObjectId(input.userId),
        });
    }

    async updateById(
        id: string,
        input: UpdateSessionInput,
    ): Promise<ChatSessionDocument | null> {
        return ChatSessionModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<ChatSessionDocument | null> {
        return ChatSessionModel.findByIdAndDelete(id).exec();
    }
}

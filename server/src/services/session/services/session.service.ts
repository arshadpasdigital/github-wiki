import { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import type { ChatSessionDocument } from "@/shared/models/chat-sessions.model";
import type {
    CreateSessionInput,
    UpdateSessionInput,
} from "../validation/session.validation";
import {
    SessionRepository,
    type SessionRepositoryContract,
} from "../repositories/session.repository";

export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepositoryContract = new SessionRepository(),
    ) {}

    async getSessions(repoId?: string, userId?: string): Promise<ChatSessionDocument[]> {
        const filter: Record<string, any> = {};
        if (repoId) filter.repoId = repoId;
        if (userId) filter.userId = userId;
        return this.sessionRepository.findAll(filter);
    }

    async getSessionById(id: string): Promise<ChatSessionDocument> {
        this.validateId(id);
        const session = await this.sessionRepository.findById(id);
        if (!session) throw new AppError("Session not found", 404);
        return session;
    }

    async createSession(input: CreateSessionInput): Promise<ChatSessionDocument> {
        this.validateObjectId(input.repoId, "Invalid repo id");
        this.validateObjectId(input.userId, "Invalid user id");
        return this.sessionRepository.create(input);
    }

    async updateSession(id: string, input: UpdateSessionInput): Promise<ChatSessionDocument> {
        this.validateId(id);
        const session = await this.sessionRepository.updateById(id, input);
        if (!session) throw new AppError("Session not found", 404);
        return session;
    }

    async deleteSession(id: string): Promise<ChatSessionDocument> {
        this.validateId(id);
        const session = await this.sessionRepository.deleteById(id);
        if (!session) throw new AppError("Session not found", 404);
        return session;
    }

    private validateId(id: string): void {
        if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid session id", 400);
    }

    private validateObjectId(id: string, message: string): void {
        if (!Types.ObjectId.isValid(id)) throw new AppError(message, 400);
    }
}

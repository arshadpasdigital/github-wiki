import asyncHandler from "@/shared/middlewares/async-handler";
import AppError from "@/shared/utils/app-error";
import {
    createSessionSchema,
    updateSessionSchema,
} from "../validation/session.validation";
import { SessionService } from "../services/session.service";
import { ApiResponse } from "@/shared/utils/api-response";

const getSessionId = (value: string | string[] | undefined): string => {
    if (typeof value !== "string" || value.length === 0) {
        throw new AppError("Session id is required", 400);
    }
    return value;
};

export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    readonly getSessions = asyncHandler(async (req, res) => {
        const repoId = typeof req.query.repoId === "string" ? req.query.repoId : undefined;
        const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
        const sessions = await this.sessionService.getSessions(repoId, userId);
        res.status(200).json(ApiResponse.success(sessions, 200, "get sessions"));
    });

    readonly getSessionById = asyncHandler(async (req, res) => {
        const session = await this.sessionService.getSessionById(getSessionId(req.params.id));
        res.status(200).json(ApiResponse.success(session, 200, "get session"));
    });

    readonly createSession = asyncHandler(async (req, res) => {
        const input = createSessionSchema.parse(req.body);
        const session = await this.sessionService.createSession(input);
        res.status(201).json(ApiResponse.success(session, 201, "create session"));
    });

    readonly updateSession = asyncHandler(async (req, res) => {
        const input = updateSessionSchema.parse(req.body);
        const session = await this.sessionService.updateSession(
            getSessionId(req.params.id),
            input,
        );
        res.status(200).json(ApiResponse.success(session, 200, "update session"));
    });

    readonly deleteSession = asyncHandler(async (req, res) => {
        const session = await this.sessionService.deleteSession(getSessionId(req.params.id));
        res.status(200).json(ApiResponse.success(session, 200, "session deleted"));
    });
}

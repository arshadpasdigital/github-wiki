import { z } from "zod";
import { ChatMessageRole } from "@/shared/models/chat-messages.model";

const citationSchema = z
    .object({
        filePath: z.string().trim().min(1, "filePath is required"),
        startLine: z.number().int().nonnegative("startLine must be non-negative"),
        endLine: z.number().int().nonnegative("endLine must be non-negative"),
    })
    .strict();

export const createMessageSchema = z
    .object({
        sessionId: z.string().trim().min(1, "sessionId is required"),
        role: z.nativeEnum(ChatMessageRole),
        content: z.string().trim().min(1, "Message content is required"),
        citations: z.array(citationSchema).default([]),
    })
    .strict();

export const updateMessageSchema = z
    .object({
        content: z.string().trim().min(1, "Message content cannot be empty").optional(),
        citations: z.array(citationSchema).optional(),
    })
    .strict()
    .refine((message) => Object.keys(message).length > 0, {
        message: "At least one message field is required",
    });

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

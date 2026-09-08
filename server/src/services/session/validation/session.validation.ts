import { z } from "zod";

export const createSessionSchema = z
    .object({
        repoId: z.string().trim().min(1, "repoId is required"),
        userId: z.string().trim().min(1, "userId is required"),
        title: z.string().trim().min(1, "Session title is required").max(200),
        pinned: z.boolean().default(false),
        isActive: z.boolean().default(true),
    })
    .strict();

export const updateSessionSchema = z
    .object({
        title: z.string().trim().min(1, "Session title cannot be empty").max(200).optional(),
        pinned: z.boolean().optional(),
        isActive: z.boolean().optional(),
    })
    .strict()
    .refine((session) => Object.keys(session).length > 0, {
        message: "At least one session field is required",
    });

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

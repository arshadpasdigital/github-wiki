import { z } from "zod";

export const recordActivitySchema = z
    .object({
        repository: z.string().trim().min(1, "repository is required"),
        action: z.string().trim().min(1, "action is required"),
        detail: z.string().trim().optional().nullable(),
        tone: z.enum(["green", "cyan", "amber", "red", "muted"]).optional(),
        repoId: z.string().trim().optional().nullable(),
    })
    .strict();

export const listActivityQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type RecordActivityInput = z.infer<typeof recordActivitySchema> & {
    userId: string;
};

export type ListActivityQuery = z.infer<typeof listActivityQuerySchema>;

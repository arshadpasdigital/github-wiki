import { Types } from "mongoose";
import type Redis from "ioredis";

import { env } from "@/shared/config/env";
import {
    ActivityTone,
    type IActivity,
} from "@/shared/models/activity.model";
import {
    ActivityRepository,
    type ActivityRepositoryContract,
} from "@/services/activity/repositories/activity.repository";
import type { RecordActivityInput } from "@/services/activity/validation/activity.validation";

const DRAIN_SCRIPT = `
local items = redis.call('LRANGE', KEYS[1], 0, ARGV[1] - 1)
if #items > 0 then
  redis.call('LTRIM', KEYS[1], #items, -1)
end
return items
`;

export class ActivityService {
    constructor(
        private readonly activityRepository: ActivityRepositoryContract =
            new ActivityRepository(),
        private readonly redisClientPromise: Promise<Redis>,
    ) {}

    async recordActivity(input: RecordActivityInput): Promise<void> {
        const redis = await this.redisClientPromise;
        const activity: IActivity = {
            userId: new Types.ObjectId(input.userId),
            repoId: input.repoId ? new Types.ObjectId(input.repoId) : null,
            repository: input.repository,
            action: input.action,
            detail: input.detail ?? null,
            tone: (input.tone as ActivityTone) ?? ActivityTone.Muted,
        };

        await redis
            .multi()
            .rpush(env.ACTIVITY_BUFFER_KEY, JSON.stringify(activity))
            .expire(env.ACTIVITY_BUFFER_KEY, env.ACTIVITY_BUFFER_TTL_SECONDS)
            .exec();
    }

    async getRecentActivity(userId: string, limit: number): Promise<IActivity[]> {
        return this.activityRepository.findRecent(userId, limit);
    }

    async flushBuffer(): Promise<number> {
        const redis = await this.redisClientPromise;
        const raw = (await redis.eval(
            DRAIN_SCRIPT,
            1,
            env.ACTIVITY_BUFFER_KEY,
            env.ACTIVITY_MAX_BATCH,
        )) as string[];

        if (!raw || raw.length === 0) {
            return 0;
        }

        const docs = raw
            .map((item) => JSON.parse(item) as IActivity)
            .filter((item) => item.userId && item.repository && item.action);

        await this.activityRepository.bulkInsert(docs);
        return docs.length;
    }
}

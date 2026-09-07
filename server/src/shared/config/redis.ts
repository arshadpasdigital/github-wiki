import Redis from "ioredis";
import { env } from "./env";

class RedisService {
    private static instance: Redis | null = null;

    private constructor() {}

    public static getInstance(): Redis {
        if (!RedisService.instance) {
            RedisService.instance = new Redis(env.REDIS_URL);
        }

        return RedisService.instance;
    }

    public static connected(): boolean {
        return RedisService.instance?.status === "ready";
    }

    public static closed(): boolean {
        const status = RedisService.instance?.status;

        return status === undefined || status === "close" || status === "end";
    }

    public static async ping(): Promise<boolean> {
        try {
            return (await RedisService.getInstance().ping()) === "PONG";
        } catch {
            return false;
        }
    }
}

export { RedisService };

export const getRedisClient = (): Promise<Redis> => {
    return Promise.resolve(RedisService.getInstance());
};

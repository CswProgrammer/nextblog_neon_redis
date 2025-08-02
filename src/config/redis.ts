import { Redis } from "ioredis";

export const redisConfig = new Redis(process.env.REDIS_URL!);

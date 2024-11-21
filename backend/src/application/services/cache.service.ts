import Redis from 'ioredis';
import { ICacheService } from '../interfaces/i-cache-service';

export class CacheService implements ICacheService {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || 'redis',
            port: Number(process.env.REDIS_PORT) || 6379,
        });
        
        this.redisClient.on('connect', () => {
            console.log('Connected to Redis!');
        });

        this.redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }

    private async keys(keysIncluded: string): Promise<string[]> {
        return await this.redisClient.keys(keysIncluded);
    }

    async delete(keysIncluded: string): Promise<void> {
        const keys = await this.keys(keysIncluded);
         for (const key of keys) {
            await this.redisClient.del(key);
        }
    }

    async set(key: string, value: any, ttl: number): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl); // TTL: time to live
    }

    async get(key: string): Promise<any | null> {
        const cachedValue = await this.redisClient.get(key);
        return cachedValue ? JSON.parse(cachedValue) : null;
    }
}

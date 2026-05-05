import { Redis } from '@upstash/redis';

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('Redis env variables are not configured');
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default redis;

// Cache utilities
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    return value as T | null;
  } catch (error) {
    console.error('[v0] Cache get error:', error);
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, exSeconds: number = 3600): Promise<void> {
  try {
    await redis.setex(key, exSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('[v0] Cache set error:', error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('[v0] Cache delete error:', error);
  }
}

export async function cacheClear(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('[v0] Cache clear error:', error);
  }
}

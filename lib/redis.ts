import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Generate a unique ID
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Helper to handle Redis errors
export async function safeRedisOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Redis operation failed:", error)
    return fallback
  }
}

// Example usage of safeRedisOperation
export async function getRedisValue(key: string): Promise<string | null> {
  return safeRedisOperation(() => redis.get(key), null)
}

export async function setRedisValue(key: string, value: string): Promise<boolean> {
  return safeRedisOperation(() => redis.set(key, value), false)
}
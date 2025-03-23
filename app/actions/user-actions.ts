"use server"

import { redis, generateId, safeRedisOperation } from "@/lib/redis"
import type { User } from "@/lib/types"
import { revalidatePath } from "next/cache"

// Create a new user
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User | null> {
  const id = generateId("user")
  const timestamp = Date.now()

  const user: User = {
    id,
    ...userData,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  return safeRedisOperation(async () => {
    // Check if email already exists
    const existingUser = await redis.get(`user:email:${userData.email}`)
    if (existingUser) {
      throw new Error("Email already in use")
    }

    // Store user data
    await redis.set(`user:${id}`, JSON.stringify(user))
    // Create an index by email for login
    await redis.set(`user:email:${userData.email}`, id)
    // Add to users set
    await redis.sadd("users", id)

    revalidatePath("/dashboard")
    revalidatePath("/login")

    return user
  }, null)
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  return safeRedisOperation(async () => {
    const userData = await redis.get(`user:${id}`)
    return userData ? JSON.parse(userData as string) : null
  }, null)
}

// Get user by email (for login)
export async function getUserByEmail(email: string): Promise<User | null> {
  return safeRedisOperation(async () => {
    const userId = await redis.get(`user:email:${email}`)
    if (!userId) return null

    const userData = await redis.get(`user:${userId}`)
    return userData ? JSON.parse(userData as string) : null
  }, null)
}

// Update user
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  return safeRedisOperation(async () => {
    const existingUserData = await redis.get(`user:${id}`)
    if (!existingUserData) return null

    const existingUser: User = JSON.parse(existingUserData as string)

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      updatedAt: Date.now(),
    }

    await redis.set(`user:${id}`, JSON.stringify(updatedUser))

    revalidatePath("/dashboard")

    return updatedUser
  }, null)
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  return safeRedisOperation(async () => {
    const userData = await redis.get(`user:${id}`)
    if (!userData) return false

    const user: User = JSON.parse(userData as string)

    // Remove user data
    await redis.del(`user:${id}`)
    // Remove email index
    await redis.del(`user:email:${user.email}`)
    // Remove from users set
    await redis.srem("users", id)

    revalidatePath("/dashboard")

    return true
  }, false)
}


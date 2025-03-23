"use server"

import { redis, generateId, safeRedisOperation } from "@/lib/redis"
import type { Transaction } from "@/lib/types"
import { getUserById, updateUser } from "./user-actions"
import { revalidatePath } from "next/cache"

// Create a transaction
export async function createTransaction(
  userId: string,
  type: "purchase" | "sale" | "deposit" | "withdrawal",
  amount: number,
  description: string,
  relatedAuctionId?: string,
): Promise<Transaction | null> {
  return safeRedisOperation(async () => {
    // Get the user
    const user = await getUserById(userId)
    if (!user) {
      return null
    }

    // Create the transaction
    const id = generateId("transaction")
    const timestamp = Date.now()

    const transaction: Transaction = {
      id,
      userId,
      type,
      amount,
      description,
      relatedAuctionId,
      timestamp,
    }

    // Store transaction data
    await redis.set(`transaction:${id}`, JSON.stringify(transaction))

    // Add to user's transactions set
    await redis.sadd(`user:${userId}:transactions`, id)

    // Update user's balance
    let newBalance = user.balance
    if (type === "purchase" || type === "withdrawal") {
      newBalance -= amount
    } else if (type === "sale" || type === "deposit") {
      newBalance += amount
    }

    await updateUser(userId, { balance: newBalance })

    revalidatePath("/dashboard")

    return transaction
  }, null)
}

// Get user's transactions
export async function getUserTransactions(userId: string, limit = 20, offset = 0): Promise<Transaction[]> {
  return safeRedisOperation(async () => {
    const transactionIds = await redis.smembers(`user:${userId}:transactions`)

    if (transactionIds.length === 0) return []

    // Get transaction data for each ID
    const transactionPromises = transactionIds.map((id: string) => redis.get(`transaction:${id}`))
    const transactionDataArray = await Promise.all(transactionPromises)

    // Parse and filter out any null values
    const transactions = transactionDataArray.filter((data: string | null): data is string => data !== null).map((data: string) => JSON.parse(data))

    // Sort by timestamp (newest first)
    transactions.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp)

    // Apply pagination
    return transactions.slice(offset, offset + limit)
  }, [])
}


"use server"

import { redis, generateId, safeRedisOperation } from "@/lib/redis"
import type { WatchlistItem, Auction } from "@/lib/types"
import { getAuctionById } from "./auction-actions"
import { revalidatePath } from "next/cache"

// Add item to watchlist
export async function addToWatchlist(userId: string, auctionId: string): Promise<WatchlistItem | null> {
  return safeRedisOperation(async () => {
    // Check if auction exists
    const auction = await getAuctionById(auctionId)
    if (!auction) {
      return null
    }

    // Check if already in watchlist
    const isWatched = await redis.sismember(`user:${userId}:watchlist`, auctionId)
    if (isWatched) {
      // Already in watchlist, return existing item
      const watchlistData = await redis.get(`watchlist:${userId}:${auctionId}`)
      return watchlistData ? JSON.parse(watchlistData as string) : null
    }

    // Create watchlist item
    const id = generateId("watchlist")
    const timestamp = Date.now()

    const watchlistItem: WatchlistItem = {
      id,
      userId,
      auctionId,
      addedAt: timestamp,
    }

    // Store watchlist item
    await redis.set(`watchlist:${userId}:${auctionId}`, JSON.stringify(watchlistItem))

    // Add to user's watchlist set
    await redis.sadd(`user:${userId}:watchlist`, auctionId)

    // Add to auction's watchers set
    await redis.sadd(`auction:${auctionId}:watchers`, userId)

    revalidatePath("/dashboard")

    return watchlistItem
  }, null)
}

// Remove item from watchlist
export async function removeFromWatchlist(userId: string, auctionId: string): Promise<boolean> {
  return safeRedisOperation(async () => {
    // Remove watchlist item
    await redis.del(`watchlist:${userId}:${auctionId}`)

    // Remove from user's watchlist set
    await redis.srem(`user:${userId}:watchlist`, auctionId)

    // Remove from auction's watchers set
    await redis.srem(`auction:${auctionId}:watchers`, userId)

    revalidatePath("/dashboard")

    return true
  }, false)
}

// Get user's watchlist
export async function getUserWatchlist(userId: string): Promise<{ item: WatchlistItem; auction: Auction }[]> {
  return safeRedisOperation(async () => {
    const auctionIds = await redis.smembers(`user:${userId}:watchlist`)

    if (auctionIds.length === 0) return []

    // Get watchlist items and auctions
    const results = await Promise.all(
      auctionIds.map(async (auctionId: string) => {
        const watchlistData = await redis.get(`watchlist:${userId}:${auctionId}`)
        const auction = await getAuctionById(auctionId)

        if (!watchlistData || !auction) return null

        return {
          item: JSON.parse(watchlistData as string),
          auction,
        }
      }),
    )

    // Filter out any null values
    return results.filter((result: { item: WatchlistItem; auction: Auction } | null) => result !== null) as { item: WatchlistItem; auction: Auction }[]
  }, [])
}

// Check if auction is in user's watchlist
export async function isInWatchlist(userId: string, auctionId: string): Promise<boolean> {
  return safeRedisOperation(async () => {
    return await redis.sismember(`user:${userId}:watchlist`, auctionId)
  }, false)
}

// Get number of watchers for an auction
export async function getWatchersCount(auctionId: string): Promise<number> {
  return safeRedisOperation(async () => {
    return await redis.scard(`auction:${auctionId}:watchers`)
  }, 0)
}


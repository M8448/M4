"use server"

import { redis, generateId, safeRedisOperation } from "@/lib/redis"
import type { Auction } from "@/lib/types"
import { revalidatePath } from "next/cache"

// Create a new auction
export async function createAuction(
  auctionData: Omit<Auction, "id" | "currentBid" | "status" | "createdAt" | "updatedAt">,
): Promise<Auction | null> {
  const id = generateId("auction")
  const timestamp = Date.now()

  const auction: Auction = {
    id,
    currentBid: auctionData.startingBid,
    status: "active",
    ...auctionData,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  return safeRedisOperation(async () => {
    // Store auction data
    await redis.set(`auction:${id}`, JSON.stringify(auction))

    // Add to active auctions set
    await redis.sadd("auctions:active", id)

    // Add to seller's auctions set
    await redis.sadd(`user:${auction.sellerId}:auctions`, id)

    // Add to category index
    await redis.sadd(`category:${auction.category}`, id)

    // Add to tags indexes
    for (const tag of auction.tags) {
      await redis.sadd(`tag:${tag}`, id)
    }

    revalidatePath("/auctions")
    revalidatePath("/dashboard")

    return auction
  }, null)
}

// Get auction by ID
export async function getAuctionById(id: string): Promise<Auction | null> {
  return safeRedisOperation(async () => {
    const auctionData = await redis.get(`auction:${id}`)
    return auctionData ? JSON.parse(auctionData as string) : null
  }, null)
}

// Update auction
export async function updateAuction(id: string, auctionData: Partial<Auction>): Promise<Auction | null> {
  return safeRedisOperation(async () => {
    const existingAuctionData = await redis.get(`auction:${id}`)
    if (!existingAuctionData) return null

    const existingAuction: Auction = JSON.parse(existingAuctionData as string)

    // Don't allow updating certain fields directly
    const { id: _, sellerId: __, createdAt: ___, ...allowedUpdates } = auctionData

    const updatedAuction: Auction = {
      ...existingAuction,
      ...allowedUpdates,
      updatedAt: Date.now(),
    }

    await redis.set(`auction:${id}`, JSON.stringify(updatedAuction))

    // Update status-based sets if status changed
    if (auctionData.status && auctionData.status !== existingAuction.status) {
      if (existingAuction.status === "active") {
        await redis.srem("auctions:active", id)
      }

      if (auctionData.status === "active") {
        await redis.sadd("auctions:active", id)
      } else if (auctionData.status === "ended") {
        await redis.sadd("auctions:ended", id)
      } else if (auctionData.status === "sold") {
        await redis.sadd("auctions:sold", id)
      }
    }

    revalidatePath("/auctions")
    revalidatePath(`/auctions/${id}`)
    revalidatePath("/dashboard")

    return updatedAuction
  }, null)
}

// Delete auction
export async function deleteAuction(id: string): Promise<boolean> {
  return safeRedisOperation(async () => {
    const auctionData = await redis.get(`auction:${id}`)
    if (!auctionData) return false

    const auction: Auction = JSON.parse(auctionData as string)

    // Remove auction data
    await redis.del(`auction:${id}`)

    // Remove from status sets
    await redis.srem("auctions:active", id)
    await redis.srem("auctions:ended", id)
    await redis.srem("auctions:sold", id)

    // Remove from seller's auctions set
    await redis.srem(`user:${auction.sellerId}:auctions`, id)

    // Remove from category index
    await redis.srem(`category:${auction.category}`, id)

    // Remove from tags indexes
    for (const tag of auction.tags) {
      await redis.srem(`tag:${tag}`, id)
    }

    revalidatePath("/auctions")
    revalidatePath("/dashboard")

    return true
  }, false)
}

// Get active auctions
export async function getActiveAuctions(limit = 20, offset = 0): Promise<Auction[]> {
  return safeRedisOperation(async () => {
    const auctionIds = await redis.smembers("auctions:active")

    // Apply pagination
    const paginatedIds = auctionIds.slice(offset, offset + limit)

    if (paginatedIds.length === 0) return []

    // Get auction data for each ID
    const auctionPromises = paginatedIds.map((id: string) => redis.get(`auction:${id}`))
    const auctionDataArray = await Promise.all(auctionPromises)

    // Parse and filter out any null values
    return auctionDataArray.filter((data: string | null): data is string => data !== null).map((data: string) => JSON.parse(data))
  }, [])
}

// Search auctions
export async function searchAuctions(query: string, filters: any = {}, limit = 20, offset = 0): Promise<Auction[]> {
  return safeRedisOperation(async () => {
    // In a real implementation, you would use a more sophisticated search mechanism
    // For now, we'll just get all active auctions and filter them in memory
    const allActiveAuctions = await getActiveAuctions(1000, 0) // Get a large batch

    let filteredAuctions = allActiveAuctions

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredAuctions = filteredAuctions.filter(
        (auction) =>
          auction.title.toLowerCase().includes(lowerQuery) ||
          auction.description.toLowerCase().includes(lowerQuery) ||
          auction.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      )
    }

    // Apply category filter
    if (filters.category) {
      filteredAuctions = filteredAuctions.filter((auction) => auction.category === filters.category)
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredAuctions = filteredAuctions.filter((auction) => auction.currentBid >= filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      filteredAuctions = filteredAuctions.filter((auction) => auction.currentBid <= filters.maxPrice)
    }

    // Apply auction type filter
    if (filters.auctionType) {
      filteredAuctions = filteredAuctions.filter((auction) => auction.auctionType === filters.auctionType)
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "price-low":
          filteredAuctions.sort((a, b) => a.currentBid - b.currentBid)
          break
        case "price-high":
          filteredAuctions.sort((a, b) => b.currentBid - a.currentBid)
          break
        case "ending-soon":
          filteredAuctions.sort((a, b) => a.endTime - b.endTime)
          break
        case "newest":
          filteredAuctions.sort((a, b) => b.createdAt - a.createdAt)
          break
        default:
          break
      }
    }

    // Apply pagination
    return filteredAuctions.slice(offset, offset + limit)
  }, [])
}

// Get auctions by seller
export async function getAuctionsBySeller(sellerId: string): Promise<Auction[]> {
  return safeRedisOperation(async () => {
    const auctionIds = await redis.smembers(`user:${sellerId}:auctions`)

    if (auctionIds.length === 0) return []

    // Get auction data for each ID
    const auctionPromises = auctionIds.map((id: string) => redis.get(`auction:${id}`))
    const auctionDataArray = await Promise.all(auctionPromises)

    // Parse and filter out any null values
    return auctionDataArray.filter((data: string | null) => data !== null).map((data: string) => JSON.parse(data))
  }, [])
}


"use server"

import { redis, generateId, safeRedisOperation } from "@/lib/redis"
import type { Bid, Auction } from "@/lib/types"
import { getAuctionById } from "./auction-actions"
import { getUserById, updateUser } from "./user-actions"
import { revalidatePath } from "next/cache"

// Place a bid
export async function placeBid(
  auctionId: string,
  userId: string,
  amount: number,
): Promise<{ success: boolean; message: string; bid?: Bid }> {
  return safeRedisOperation(
    async () => {
      // Get the auction
      const auction = await getAuctionById(auctionId)
      if (!auction) {
        return { success: false, message: "Auction not found" }
      }

      // Check if auction is active
      if (auction.status !== "active") {
        return { success: false, message: "Auction is not active" }
      }

      // Check if auction has ended
      if (Date.now() > auction.endTime) {
        // Update auction status to ended
        await redis.set(
          `auction:${auctionId}`,
          JSON.stringify({
            ...auction,
            status: "ended",
            updatedAt: Date.now(),
          }),
        )
        return { success: false, message: "Auction has ended" }
      }

      // Check if bid amount is valid
      if (amount <= auction.currentBid) {
        return { success: false, message: "Bid amount must be higher than current bid" }
      }

      if (amount < auction.currentBid + auction.minBidIncrement) {
        return { success: false, message: `Minimum bid increment is $${auction.minBidIncrement}` }
      }

      // Get the user
      const user = await getUserById(userId)
      if (!user) {
        return { success: false, message: "User not found" }
      }

      // Check if user has enough balance (optional, depends on your business logic)
      if (user.balance < amount) {
        return { success: false, message: "Insufficient balance" }
      }

      // Create the bid
      const id = generateId("bid")
      const timestamp = Date.now()

      const bid: Bid = {
        id,
        auctionId,
        userId,
        amount,
        timestamp,
      }

      // Store bid data
      await redis.set(`bid:${id}`, JSON.stringify(bid))

      // Add to auction's bids set
      await redis.sadd(`auction:${auctionId}:bids`, id)

      // Add to user's bids set
      await redis.sadd(`user:${userId}:bids`, id)

      // Update auction's current bid
      await redis.set(
        `auction:${auctionId}`,
        JSON.stringify({
          ...auction,
          currentBid: amount,
          updatedAt: timestamp,
        }),
      )

      // Check if this is a "Buy It Now" bid
      if (auction.buyNow && amount >= auction.buyNow) {
        // End the auction and mark as sold
        await redis.set(
          `auction:${auctionId}`,
          JSON.stringify({
            ...auction,
            currentBid: amount,
            status: "sold",
            updatedAt: timestamp,
          }),
        )

        // Remove from active auctions set
        await redis.srem("auctions:active", auctionId)

        // Add to sold auctions set
        await redis.sadd("auctions:sold", auctionId)
      }

      // If it's a time-extended auction and the bid is placed near the end,
      // extend the auction end time
      if (auction.auctionType === "Time-Extended" && auction.endTime - timestamp < 5 * 60 * 1000) {
        // Extend by 5 minutes
        const newEndTime = auction.endTime + 5 * 60 * 1000

        await redis.set(
          `auction:${auctionId}`,
          JSON.stringify({
            ...auction,
            currentBid: amount,
            endTime: newEndTime,
            updatedAt: timestamp,
          }),
        )
      }

      // Award points to the bidder (optional)
      await updateUser(userId, {
        points: user.points + 5, // Award 5 points for placing a bid
      })

      revalidatePath(`/auctions/${auctionId}`)
      revalidatePath("/dashboard")

      return {
        success: true,
        message: "Bid placed successfully",
        bid,
      }
    },
    { success: false, message: "An error occurred while placing the bid" },
  )
}

// Get bids for an auction
export async function getBidsForAuction(auctionId: string): Promise<Bid[]> {
  return safeRedisOperation(async () => {
    const bidIds = await redis.smembers(`auction:${auctionId}:bids`)

    if (bidIds.length === 0) return []

    // Get bid data for each ID
    const bidPromises: Promise<string | null>[] = bidIds.map((id: string): Promise<string | null> => redis.get(`bid:${id}`))
    const bidDataArray = await Promise.all(bidPromises)

    // Parse and filter out any null values
    const bids = bidDataArray.filter((data): data is string => data !== null).map((data) => JSON.parse(data))

    // Sort by timestamp (newest first)
    return bids.sort((a, b) => b.timestamp - a.timestamp)
  }, [])
}

// Get bids by user
export async function getBidsByUser(userId: string): Promise<{ bid: Bid; auction: Auction }[]> {
  return safeRedisOperation(async () => {
    const bidIds = await redis.smembers(`user:${userId}:bids`)

    if (bidIds.length === 0) return []

    // Get bid data for each ID
    const bidPromises = bidIds.map((id: string) => redis.get(`bid:${id}`))
    const bidDataArray = await Promise.all(bidPromises)

    // Parse and filter out any null values
    const bids = bidDataArray.filter((data: string | null): data is string => data !== null).map((data: string) => JSON.parse(data))

    // Get auction data for each bid
    const results = await Promise.all(
      bids.map(async (bid: Bid) => {
        const auction = await getAuctionById(bid.auctionId)
        return { bid, auction: auction! }
      }),
    )

    // Filter out any bids with missing auctions
    return results.filter((result: { bid: Bid; auction: Auction | null }) => result.auction !== null)
  }, [])
}

// Get highest bid for an auction
export async function getHighestBidForAuction(auctionId: string): Promise<Bid | null> {
  return safeRedisOperation(async () => {
    const bids = await getBidsForAuction(auctionId)

    if (bids.length === 0) return null

    // Sort by amount (highest first)
    bids.sort((a, b) => b.amount - a.amount)

    return bids[0]
  }, null)
}


import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { getAuctionById, updateAuction } from "@/app/actions/auction-actions"
import { getBidsForAuction } from "@/app/actions/bid-actions"
import { createTransaction } from "@/app/actions/transaction-actions"

// This endpoint should be called by a cron job every few minutes
// You can set up a cron job using Vercel Cron Jobs or a service like Upstash QStash

export async function GET() {
  try {
    // Get all active auctions
    const activeAuctionIds = await redis.smembers("auctions:active")

    if (activeAuctionIds.length === 0) {
      return NextResponse.json({ message: "No active auctions to process" })
    }

    const now = Date.now()
    const processedAuctions = []

    // Check each active auction
    for (const auctionId of activeAuctionIds) {
      const auction = await getAuctionById(auctionId)

      if (!auction) continue

      // Check if auction has ended
      if (now >= auction.endTime && auction.status === "active") {
        // Get the highest bid
        const bids = await getBidsForAuction(auctionId)

        if (bids.length > 0) {
          // Sort bids by amount (highest first)
          bids.sort((a, b) => b.amount - a.amount)
          const highestBid = bids[0]

          // Check if reserve price is met (if applicable)
          if (auction.auctionType === "Reserve" && auction.reservePrice && highestBid.amount < auction.reservePrice) {
            // Reserve price not met, end auction without a sale
            await updateAuction(auctionId, {
              status: "ended",
              updatedAt: now,
            })

            processedAuctions.push({
              auctionId,
              status: "ended",
              reason: "Reserve price not met",
            })
          } else {
            // Mark auction as sold
            await updateAuction(auctionId, {
              status: "sold",
              updatedAt: now,
            })

            // Create transactions for buyer and seller
            await createTransaction(
              highestBid.userId,
              "purchase",
              highestBid.amount,
              `Purchase of ${auction.title}`,
              auctionId,
            )

            await createTransaction(auction.sellerId, "sale", highestBid.amount, `Sale of ${auction.title}`, auctionId)

            processedAuctions.push({
              auctionId,
              status: "sold",
              buyerId: highestBid.userId,
              amount: highestBid.amount,
            })
          }
        } else {
          // No bids, end auction without a sale
          await updateAuction(auctionId, {
            status: "ended",
            updatedAt: now,
          })

          processedAuctions.push({
            auctionId,
            status: "ended",
            reason: "No bids",
          })
        }
      }
    }

    return NextResponse.json({
      message: `Processed ${processedAuctions.length} auctions`,
      processedAuctions,
    })
  } catch (error) {
    console.error("Error processing auction end times:", error)
    return NextResponse.json({ error: "Failed to process auction end times" }, { status: 500 })
  }
}


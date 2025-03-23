// This is a script to seed the database with initial data
// Run it with: npx tsx scripts/seed.ts

import { redis } from "../lib/redis"
import type { User, Auction, Bid, WatchlistItem, Transaction } from "../lib/types"

async function seed() {
  console.log("Seeding database...")

  // Clear existing data
  await redis.flushall()

  // Create users
  const users: User[] = [
    {
      id: "user_1",
      name: "John Smith",
      email: "john@example.com",
      password: "password123", // In a real app, this would be hashed
      memberSince: "March 2023",
      rating: 4.9,
      verified: true,
      balance: 1000,
      points: 320,
      tier: "Gold",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      updatedAt: Date.now(),
    },
    {
      id: "user_2",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      memberSince: "January 2023",
      rating: 4.8,
      verified: true,
      balance: 750,
      points: 180,
      tier: "Silver",
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      updatedAt: Date.now(),
    },
    {
      id: "user_3",
      name: "Bob Johnson",
      email: "bob@example.com",
      password: "password123",
      memberSince: "May 2023",
      rating: 4.5,
      verified: false,
      balance: 500,
      points: 120,
      tier: "Bronze",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      updatedAt: Date.now(),
    },
  ]

  // Store users
  for (const user of users) {
    await redis.set(`user:${user.id}`, JSON.stringify(user))
    await redis.set(`user:email:${user.email}`, user.id)
    await redis.sadd("users", user.id)
  }

  // Create auctions
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  const auctions: Auction[] = [
    {
      id: "auction_1",
      title: "Vintage Leather Jacket",
      description:
        "This authentic vintage leather jacket is crafted from premium cowhide leather. Features a classic design with zippered front, two side pockets, and one interior pocket. The jacket has been well-maintained and shows minimal signs of wear, giving it that perfect vintage character without compromising quality.",
      images: ["/placeholder.svg?height=500&width=700"],
      currentBid: 120,
      buyNow: 250,
      startingBid: 80,
      minBidIncrement: 5,
      sellerId: "user_1",
      auctionType: "Classic",
      condition: "Very Good",
      category: "Fashion",
      location: "Riga, Latvia",
      tags: ["vintage", "leather", "jacket", "men's fashion", "outerwear"],
      shippingOptions: [
        { method: "Standard Shipping", cost: 12, time: "5-7 business days" },
        { method: "Express Shipping", cost: 25, time: "2-3 business days" },
        { method: "Local Pickup", cost: 0, time: "By arrangement" },
      ],
      startTime: now - 3 * day,
      endTime: now + 2 * day,
      status: "active",
      createdAt: now - 3 * day,
      updatedAt: now,
    },
    {
      id: "auction_2",
      title: "Professional DSLR Camera",
      description:
        "High-quality DSLR camera with multiple lenses and accessories. Perfect for professional photography or serious hobbyists. Includes the camera body, 3 lenses, a carrying case, and extra batteries.",
      images: ["/placeholder.svg?height=500&width=700"],
      currentBid: 550,
      buyNow: 800,
      startingBid: 400,
      minBidIncrement: 10,
      sellerId: "user_2",
      auctionType: "Reserve",
      reservePrice: 600,
      condition: "Excellent",
      category: "Electronics",
      location: "Riga, Latvia",
      tags: ["camera", "photography", "DSLR", "professional", "electronics"],
      shippingOptions: [
        { method: "Standard Shipping", cost: 15, time: "5-7 business days" },
        { method: "Express Shipping", cost: 30, time: "2-3 business days" },
      ],
      startTime: now - 2 * day,
      endTime: now + 1 * day,
      status: "active",
      createdAt: now - 2 * day,
      updatedAt: now,
    },
    {
      id: "auction_3",
      title: "Handcrafted Wooden Desk",
      description:
        "Beautiful handcrafted wooden desk made from solid oak. Features three drawers for storage and a spacious work surface. The desk has been finished with a natural oil that enhances the wood grain while providing protection.",
      images: ["/placeholder.svg?height=500&width=700"],
      currentBid: 320,
      buyNow: 450,
      startingBid: 250,
      minBidIncrement: 10,
      sellerId: "user_3",
      auctionType: "Time-Extended",
      condition: "New",
      category: "Home & Garden",
      location: "Riga, Latvia",
      tags: ["furniture", "desk", "wooden", "handcrafted", "home office"],
      shippingOptions: [
        { method: "Freight Shipping", cost: 50, time: "7-10 business days" },
        { method: "Local Pickup", cost: 0, time: "By arrangement" },
      ],
      startTime: now - 4 * day,
      endTime: now + 4 * day,
      status: "active",
      createdAt: now - 4 * day,
      updatedAt: now,
    },
    {
      id: "auction_4",
      title: "Rare Vinyl Record Collection",
      description:
        "A collection of 50 rare vinyl records from the 1960s and 1970s. Includes albums from legendary artists in excellent condition. Most are first pressings and have been stored properly in a climate-controlled environment.",
      images: ["/placeholder.svg?height=500&width=700"],
      currentBid: 180,
      buyNow: 300,
      startingBid: 150,
      minBidIncrement: 5,
      sellerId: "user_2",
      auctionType: "Buy It Now",
      condition: "Good",
      category: "Collectibles",
      location: "Riga, Latvia",
      tags: ["vinyl", "records", "music", "collectible", "vintage"],
      shippingOptions: [
        { method: "Standard Shipping", cost: 10, time: "5-7 business days" },
        { method: "Express Shipping", cost: 20, time: "2-3 business days" },
      ],
      startTime: now - 1 * day,
      endTime: now + 6 * day,
      status: "active",
      createdAt: now - 1 * day,
      updatedAt: now,
    },
  ]

  // Store auctions
  for (const auction of auctions) {
    await redis.set(`auction:${auction.id}`, JSON.stringify(auction))

    // Add to active auctions set
    if (auction.status === "active") {
      await redis.sadd("auctions:active", auction.id)
    }

    // Add to seller's auctions set
    await redis.sadd(`user:${auction.sellerId}:auctions`, auction.id)

    // Add to category index
    await redis.sadd(`category:${auction.category}`, auction.id)

    // Add to tags indexes
    for (const tag of auction.tags) {
      await redis.sadd(`tag:${tag}`, auction.id)
    }
  }

  // Create bids
  const bids: Bid[] = [
    {
      id: "bid_1",
      auctionId: "auction_1",
      userId: "user_2",
      amount: 100,
      timestamp: now - 2 * day,
    },
    {
      id: "bid_2",
      auctionId: "auction_1",
      userId: "user_3",
      amount: 110,
      timestamp: now - 1 * day,
    },
    {
      id: "bid_3",
      auctionId: "auction_1",
      userId: "user_2",
      amount: 120,
      timestamp: now - 12 * 60 * 60 * 1000,
    },
    {
      id: "bid_4",
      auctionId: "auction_2",
      userId: "user_1",
      amount: 500,
      timestamp: now - 1.5 * day,
    },
    {
      id: "bid_5",
      auctionId: "auction_2",
      userId: "user_3",
      amount: 550,
      timestamp: now - 0.5 * day,
    },
    {
      id: "bid_6",
      auctionId: "auction_3",
      userId: "user_1",
      amount: 300,
      timestamp: now - 2 * day,
    },
    {
      id: "bid_7",
      auctionId: "auction_3",
      userId: "user_2",
      amount: 320,
      timestamp: now - 1 * day,
    },
  ]

  // Store bids
  for (const bid of bids) {
    await redis.set(`bid:${bid.id}`, JSON.stringify(bid))

    // Add to auction's bids set
    await redis.sadd(`auction:${bid.auctionId}:bids`, bid.id)

    // Add to user's bids set
    await redis.sadd(`user:${bid.userId}:bids`, bid.id)
  }

  // Create watchlist items
  const watchlistItems: WatchlistItem[] = [
    {
      id: "watchlist_1",
      userId: "user_1",
      auctionId: "auction_2",
      addedAt: now - 2 * day,
    },
    {
      id: "watchlist_2",
      userId: "user_1",
      auctionId: "auction_4",
      addedAt: now - 1 * day,
    },
    {
      id: "watchlist_3",
      userId: "user_2",
      auctionId: "auction_3",
      addedAt: now - 3 * day,
    },
    {
      id: "watchlist_4",
      userId: "user_3",
      auctionId: "auction_1",
      addedAt: now - 0.5 * day,
    },
  ]

  // Store watchlist items
  for (const item of watchlistItems) {
    await redis.set(`watchlist:${item.userId}:${item.auctionId}`, JSON.stringify(item))

    // Add to user's watchlist set
    await redis.sadd(`user:${item.userId}:watchlist`, item.auctionId)

    // Add to auction's watchers set
    await redis.sadd(`auction:${item.auctionId}:watchers`, item.userId)
  }

  // Create transactions
  const transactions: Transaction[] = [
    {
      id: "transaction_1",
      userId: "user_1",
      type: "deposit",
      amount: 1000,
      description: "Initial deposit",
      timestamp: now - 29 * day,
    },
    {
      id: "transaction_2",
      userId: "user_2",
      type: "deposit",
      amount: 750,
      description: "Initial deposit",
      timestamp: now - 59 * day,
    },
    {
      id: "transaction_3",
      userId: "user_3",
      type: "deposit",
      amount: 500,
      description: "Initial deposit",
      timestamp: now - 14 * day,
    },
    {
      id: "transaction_4",
      userId: "user_1",
      type: "purchase",
      amount: 200,
      description: "Purchase of Antique Vase",
      relatedAuctionId: "auction_old_1",
      timestamp: now - 20 * day,
    },
    {
      id: "transaction_5",
      userId: "user_2",
      type: "sale",
      amount: 200,
      description: "Sale of Antique Vase",
      relatedAuctionId: "auction_old_1",
      timestamp: now - 20 * day,
    },
  ]

  // Store transactions
  for (const transaction of transactions) {
    await redis.set(`transaction:${transaction.id}`, JSON.stringify(transaction))

    // Add to user's transactions set
    await redis.sadd(`user:${transaction.userId}:transactions`, transaction.id)
  }

  console.log("Database seeded successfully!")
}

// Run the seed function
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error)
    process.exit(1)
  })


export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  memberSince: string
  rating: number
  verified: boolean
  balance: number
  points: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  createdAt: number
  updatedAt: number
}

export type AuctionType = "Classic" | "Buy It Now" | "Reserve" | "Time-Extended"

export type Auction = {
  id: string
  title: string
  description: string
  images: string[]
  currentBid: number
  buyNow?: number
  reservePrice?: number
  startingBid: number
  minBidIncrement: number
  sellerId: string
  auctionType: AuctionType
  condition: string
  category: string
  location: string
  tags: string[]
  shippingOptions: ShippingOption[]
  startTime: number
  endTime: number
  status: "active" | "ended" | "sold" | "cancelled"
  createdAt: number
  updatedAt: number
}

export type ShippingOption = {
  method: string
  cost: number
  time: string
}

export type Bid = {
  id: string
  auctionId: string
  userId: string
  amount: number
  timestamp: number
}

export type WatchlistItem = {
  id: string
  userId: string
  auctionId: string
  addedAt: number
}

export type Transaction = {
  id: string
  userId: string
  type: "purchase" | "sale" | "deposit" | "withdrawal"
  amount: number
  relatedAuctionId?: string
  description: string
  timestamp: number
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  Clock,
  Heart,
  Share2,
  Flag,
  Shield,
  TrendingUp,
  CheckCircle,
  Star,
  AlertTriangle,
  Truck,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import { getAuctionById } from "@/app/actions/auction-actions"
import { placeBid, getBidsForAuction } from "@/app/actions/bid-actions"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/app/actions/watchlist-actions"
import { getCurrentUser } from "@/lib/auth"
import type { Auction, Bid, User } from "@/lib/types"

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [bidAmount, setBidAmount] = useState("")
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBidding, setIsBidding] = useState(false)
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [timeLeftPercent, setTimeLeftPercent] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the auction
        const auctionData = await getAuctionById(params.id)
        if (!auctionData) {
          toast({
            title: "Auction not found",
            description: "The auction you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          })
          router.push("/auctions")
          return
        }

        setAuction(auctionData)

        // Get the bids
        const bidsData = await getBidsForAuction(params.id)
        setBids(bidsData)

        // Get the current user
        const userData = await getCurrentUser()
        setCurrentUser(userData)

        // Check if the auction is in the user's watchlist
        if (userData) {
          const watched = await isInWatchlist(userData.id, params.id)
          setIsWatchlisted(watched)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching auction data:", error)
        toast({
          title: "Error",
          description: "Failed to load auction data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [params.id, router])

  useEffect(() => {
    if (!auction) return

    // Calculate time left
    const updateTimeLeft = () => {
      const now = Date.now()
      const timeRemaining = auction.endTime - now

      if (timeRemaining <= 0) {
        setTimeLeft("Auction ended")
        setTimeLeftPercent(0)
        return
      }

      const totalDuration = auction.endTime - auction.startTime
      const percentLeft = (timeRemaining / totalDuration) * 100
      setTimeLeftPercent(percentLeft)

      // Format time left
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`)
      } else if (hours > 0) {
        setTimeLeft(`${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}`)
      } else {
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes} minute${minutes !== 1 ? "s" : ""}, ${seconds} second${seconds !== 1 ? "s" : ""}`)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [auction])

  const handleBid = async () => {
    if (!auction || !currentUser) {
      toast({
        title: "Login required",
        description: "You need to be logged in to place a bid.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/auctions/${params.id}`)
      return
    }

    const amount = Number.parseFloat(bidAmount)
    if (isNaN(amount) || amount <= auction.currentBid) {
      toast({
        title: "Invalid bid amount",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive",
      })
      return
    }

    if (amount < auction.currentBid + auction.minBidIncrement) {
      toast({
        title: "Invalid bid amount",
        description: `Minimum bid increment is $${auction.minBidIncrement.toFixed(2)}.`,
        variant: "destructive",
      })
      return
    }

    setIsBidding(true)

    try {
      const result = await placeBid(auction.id, currentUser.id, amount)

      if (result.success) {
        toast({
          title: "Bid placed",
          description: "Your bid has been placed successfully.",
        })

        // Refresh auction data
        const updatedAuction = await getAuctionById(params.id)
        setAuction(updatedAuction)

        // Refresh bids
        const updatedBids = await getBidsForAuction(params.id)
        setBids(updatedBids)

        setBidAmount("")
      } else {
        toast({
          title: "Bid failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error placing bid:", error)
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBidding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!auction || !currentUser) {
      toast({
        title: "Login required",
        description: "You need to be logged in to buy this item.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/auctions/${params.id}`)
      return
    }

    if (!auction.buyNow) {
      toast({
        title: "Not available",
        description: "This item doesn't have a Buy It Now option.",
        variant: "destructive",
      })
      return
    }

    setIsBidding(true)

    try {
      const result = await placeBid(auction.id, currentUser.id, auction.buyNow)

      if (result.success) {
        toast({
          title: "Purchase successful",
          description: "You have successfully purchased this item.",
        })

        // Redirect to checkout or confirmation page
        router.push(`/checkout/${auction.id}`)
      } else {
        toast({
          title: "Purchase failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error buying now:", error)
      toast({
        title: "Error",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBidding(false)
    }
  }

  const toggleWatchlist = async () => {
    if (!auction || !currentUser) {
      toast({
        title: "Login required",
        description: "You need to be logged in to add items to your watchlist.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/auctions/${params.id}`)
      return
    }

    try {
      if (isWatchlisted) {
        await removeFromWatchlist(currentUser.id, auction.id)
        setIsWatchlisted(false)
        toast({
          title: "Removed from watchlist",
          description: "This item has been removed from your watchlist.",
        })
      } else {
        await addToWatchlist(currentUser.id, auction.id)
        setIsWatchlisted(true)
        toast({
          title: "Added to watchlist",
          description: "This item has been added to your watchlist.",
        })
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !auction) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading auction details...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span className="font-bold text-xl">BidMarket</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/auctions" className="text-sm font-medium transition-colors hover:text-primary">
              Browse Auctions
            </Link>
            <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
              Sell an Item
            </Link>
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  My Account
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:py-8">
          <div className="mb-4">
            <div className="text-sm breadcrumbs">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <span className="text-muted-foreground mx-2">/</span>
              <Link href="/auctions" className="text-muted-foreground hover:text-foreground">
                Auctions
              </Link>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-foreground">{auction.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border">
                <Image
                  src={auction.images[0] || "/placeholder.svg"}
                  alt={auction.title}
                  width={700}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="font-medium">
                    {auction.auctionType}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {auction.images.map((image, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden border cursor-pointer">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${auction.title} - Image ${index + 1}`}
                      width={150}
                      height={100}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Auction Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{auction.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Link
                      href={`/seller/${auction.sellerId}`}
                      className="text-sm font-medium hover:underline flex items-center"
                    >
                      {/* We would need to fetch seller details here */}
                      <CheckCircle className="h-3 w-3 mr-1 text-primary" />
                      Seller
                    </Link>
                    <span className="flex items-center ml-2">
                      <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                      <span className="text-sm">4.9</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Time left:</span>
                  </div>
                  <span className="font-bold text-sm">{timeLeft}</span>
                </div>
                <Progress value={timeLeftPercent} className="h-2 mb-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current bid:</span>
                    <span className="font-bold text-xl">${auction.currentBid.toFixed(2)}</span>
                  </div>
                  {auction.buyNow && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Buy it now price:</span>
                      <span className="font-bold">${auction.buyNow.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span>Minimum bid increment:</span>
                    <span>${auction.minBidIncrement.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Number of bids:</span>
                    <Link href="#bid-history" className="text-primary hover:underline">
                      {bids.length} bids
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bid-amount" className="text-sm font-medium">
                    Your maximum bid
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="bid-amount"
                      type="number"
                      min={auction.currentBid + auction.minBidIncrement}
                      step={auction.minBidIncrement}
                      placeholder={(auction.currentBid + auction.minBidIncrement).toFixed(2)}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter ${(auction.currentBid + auction.minBidIncrement).toFixed(2)} or more
                  </p>
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <Button
                    onClick={handleBid}
                    disabled={
                      !bidAmount ||
                      Number.parseFloat(bidAmount) < auction.currentBid + auction.minBidIncrement ||
                      isBidding
                    }
                  >
                    {isBidding ? "Processing..." : "Place Bid"}
                  </Button>
                  {auction.buyNow && (
                    <Button variant="outline" onClick={handleBuyNow} disabled={isBidding}>
                      Buy It Now: ${auction.buyNow.toFixed(2)}
                    </Button>
                  )}
                </div>
              </div>

              <Alert className="bg-primary/10 border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  This auction is covered by BidMarket Buyer Protection. Learn more about our{" "}
                  <Link href="/buyer-protection" className="font-medium hover:underline">
                    Buyer Protection Program
                  </Link>
                  .
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={toggleWatchlist}>
                  <Heart className={`h-4 w-4 mr-2 ${isWatchlisted ? "fill-destructive text-destructive" : ""}`} />
                  {isWatchlisted ? "Watching" : "Add to Watchlist"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Item
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Item Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Payment</TabsTrigger>
                <TabsTrigger value="seller">Seller Information</TabsTrigger>
                <TabsTrigger value="bids" id="bid-history">
                  Bid History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <div className="space-y-4">
                      <p>{auction.description}</p>
                    </div>

                    <h3 className="text-lg font-semibold mt-8 mb-4">Item Specifics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Condition</span>
                        <span>{auction.condition}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span>{auction.category}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span>{auction.location}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-8 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {auction.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Auction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Auction type</span>
                        <span>{auction.auctionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Starting bid</span>
                        <span>${auction.startingBid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current bid</span>
                        <span className="font-bold">${auction.currentBid.toFixed(2)}</span>
                      </div>
                      {auction.buyNow && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Buy it now price</span>
                          <span>${auction.buyNow.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start time</span>
                        <span>{new Date(auction.startTime).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">End time</span>
                        <span>{new Date(auction.endTime).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
                    <div className="space-y-4">
                      {auction.shippingOptions.map((option, index) => (
                        <div key={index} className="flex items-start p-4 border rounded-lg">
                          <Truck className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{option.method}</h4>
                              <span className="font-bold">${option.cost.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{option.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mt-8 mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                      <div className="flex items-start p-4 border rounded-lg">
                        <CreditCard className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Credit/Debit Cards</h4>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                        </div>
                      </div>
                      <div className="flex items-start p-4 border rounded-lg">
                        <Shield className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">BidMarket Secure Payment</h4>
                          <p className="text-sm text-muted-foreground">
                            Funds are held in escrow until you receive the item
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert className="mt-8 bg-muted border-muted-foreground/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        For your security, we recommend using BidMarket Secure Payment for all transactions. Never pay
                        outside of the platform.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Returns & Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Return Policy</h4>
                        <p className="text-sm text-muted-foreground">Returns accepted within 14 days</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Buyer Protection</h4>
                        <p className="text-sm text-muted-foreground">
                          This item is covered by BidMarket Buyer Protection. We'll help you get your money back if the
                          item doesn't arrive or isn't as described.
                        </p>
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        <Link href="/buyer-protection" className="w-full">
                          Learn More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="seller" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Seller</h3>
                          <Badge variant="outline" className="text-xs font-normal">
                            <CheckCircle className="h-3 w-3 mr-1 text-primary" />
                            Verified Seller
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">4.9</span>
                          <span className="text-sm text-muted-foreground">(342 sales)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Member since March 2019</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Seller Ratings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Item as described</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= 5 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Communication</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= 5 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Shipping speed</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= 4 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Seller Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Positive ratings</span>
                          <span className="font-medium">98%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Completed sales</span>
                          <span className="font-medium">342</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Response time</span>
                          <span className="font-medium">Within 24 hours</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Seller</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bids" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Bid History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Bidder</th>
                            <th className="text-left py-3 px-4 font-medium">Bid Amount</th>
                            <th className="text-left py-3 px-4 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bids.length > 0 ? (
                            bids.map((bid, index) => (
                              <tr key={bid.id} className="border-b">
                                <td className="py-3 px-4">
                                  {bid.userId === currentUser?.id ? "You" : `User${index + 1}`}
                                </td>
                                <td className="py-3 px-4 font-medium">${bid.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-muted-foreground">
                                  {new Date(bid.timestamp).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="py-6 text-center text-muted-foreground">
                                No bids yet. Be the first to bid!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Bidding Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Starting bid</h4>
                        <p className="text-sm">${auction.startingBid.toFixed(2)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Current bid</h4>
                        <p className="text-sm font-bold">${auction.currentBid.toFixed(2)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Bid increment</h4>
                        <p className="text-sm">${auction.minBidIncrement.toFixed(2)}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-1">Your maximum bid</h4>
                        <div className="flex mt-2">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            min={auction.currentBid + auction.minBidIncrement}
                            step={auction.minBidIncrement}
                            placeholder={(auction.currentBid + auction.minBidIncrement).toFixed(2)}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        disabled={
                          !bidAmount ||
                          Number.parseFloat(bidAmount) < auction.currentBid + auction.minBidIncrement ||
                          isBidding
                        }
                        onClick={handleBid}
                      >
                        {isBidding ? "Processing..." : "Place Bid"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">BidMarket</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 BidMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


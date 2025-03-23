"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Filter, Search, CheckCircle, Star, TrendingUp } from "lucide-react"

export default function AuctionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)

  // Sample auctions data
  const auctions = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      currentBid: 120,
      buyNow: 250,
      timeLeft: "2 days, 5 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 8,
      seller: {
        name: "VintageTreasures",
        rating: 4.9,
        verified: true,
      },
      auctionType: "Classic",
    },
    {
      id: 2,
      title: "Professional DSLR Camera",
      currentBid: 550,
      buyNow: 800,
      timeLeft: "1 day, 3 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 12,
      seller: {
        name: "TechGadgets",
        rating: 4.8,
        verified: true,
      },
      auctionType: "Reserve",
    },
    {
      id: 3,
      title: "Handcrafted Wooden Desk",
      currentBid: 320,
      buyNow: 450,
      timeLeft: "4 days, 12 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 5,
      seller: {
        name: "ArtisanCrafts",
        rating: 5.0,
        verified: true,
      },
      auctionType: "Time-Extended",
    },
    {
      id: 4,
      title: "Rare Vinyl Record Collection",
      currentBid: 180,
      buyNow: 300,
      timeLeft: "6 hours, 45 minutes",
      image: "/placeholder.svg?height=200&width=300",
      bids: 15,
      seller: {
        name: "MusicCollector",
        rating: 4.7,
        verified: false,
      },
      auctionType: "Buy It Now",
    },
    {
      id: 5,
      title: "Antique Pocket Watch",
      currentBid: 95,
      buyNow: 150,
      timeLeft: "3 days, 8 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 7,
      seller: {
        name: "TimelessTreasures",
        rating: 4.6,
        verified: true,
      },
      auctionType: "Classic",
    },
    {
      id: 6,
      title: "Mountain Bike - Premium Model",
      currentBid: 420,
      buyNow: 650,
      timeLeft: "5 days, 2 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 9,
      seller: {
        name: "OutdoorAdventures",
        rating: 4.9,
        verified: true,
      },
      auctionType: "Reserve",
    },
    {
      id: 7,
      title: "Designer Handbag - Limited Edition",
      currentBid: 780,
      buyNow: 1200,
      timeLeft: "1 day, 15 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 22,
      seller: {
        name: "LuxuryFinds",
        rating: 4.8,
        verified: true,
      },
      auctionType: "Time-Extended",
    },
    {
      id: 8,
      title: "Smart Home Security System",
      currentBid: 210,
      buyNow: 350,
      timeLeft: "6 days, 9 hours",
      image: "/placeholder.svg?height=200&width=300",
      bids: 4,
      seller: {
        name: "TechInnovations",
        rating: 4.7,
        verified: true,
      },
      auctionType: "Buy It Now",
    },
  ]

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
            <Link href="/auctions" className="text-sm font-medium text-primary transition-colors">
              Browse Auctions
            </Link>
            <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
              Sell an Item
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Browse Auctions</h1>
            <p className="text-muted-foreground">Find unique items with active bidding</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest listings</SelectItem>
                  <SelectItem value="ending-soon">Ending soon</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="most-bids">Most bids</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="space-y-6 sticky top-24">
                <div>
                  <h3 className="font-medium mb-3">Auction Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="classic" />
                      <Label htmlFor="classic">Classic Auction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="buy-now" />
                      <Label htmlFor="buy-now">Buy It Now</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reserve" />
                      <Label htmlFor="reserve">Reserve Price</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="time-extended" />
                      <Label htmlFor="time-extended">Time-Extended</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={10}
                      onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex items-center justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Seller Rating</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-4.5" />
                      <Label htmlFor="rating-4.5" className="flex items-center">
                        <span className="mr-1">4.5+</span>
                        <Star className="h-3 w-3 fill-primary text-primary" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-4" />
                      <Label htmlFor="rating-4" className="flex items-center">
                        <span className="mr-1">4.0+</span>
                        <Star className="h-3 w-3 fill-primary text-primary" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified-only" />
                      <Label htmlFor="verified-only" className="flex items-center">
                        <span className="mr-1">Verified only</span>
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>

            <div className="md:col-span-3">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
                  <TabsTrigger value="new-arrivals">New Arrivals</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <Link href={`/auctions/${auction.id}`} key={auction.id} className="group">
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <div className="relative">
                        <Image
                          src={auction.image || "/placeholder.svg"}
                          alt={auction.title}
                          width={300}
                          height={200}
                          className="w-full h-[200px] object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="font-medium">
                            {auction.auctionType}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {auction.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <span className="flex items-center">
                            {auction.seller.verified && <CheckCircle className="h-3 w-3 mr-1 text-primary" />}
                            {auction.seller.name}
                          </span>
                          <span className="flex items-center ml-auto">
                            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                            {auction.seller.rating}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Current Bid:</span>
                          <span className="font-bold">${auction.currentBid}</span>
                        </div>
                        {auction.buyNow && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Buy Now:</span>
                            <span className="font-bold">${auction.buyNow}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {auction.timeLeft}
                        </div>
                        <div className="text-sm text-muted-foreground">{auction.bids} bids</div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
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


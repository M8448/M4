import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Star, TrendingUp, Award, CheckCircle } from "lucide-react"

export default function Home() {
  // Sample featured auctions
  const featuredAuctions = [
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
  ]

  // Sample categories
  const categories = [
    { name: "Electronics", icon: "💻", count: 1245 },
    { name: "Collectibles", icon: "🏆", count: 876 },
    { name: "Fashion", icon: "👕", count: 2134 },
    { name: "Home & Garden", icon: "🏡", count: 1532 },
    { name: "Art", icon: "🎨", count: 654 },
    { name: "Vehicles", icon: "🚗", count: 432 },
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
            <Link href="/auctions" className="text-sm font-medium transition-colors hover:text-primary">
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
              <Button variant="outline" size="sm">
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
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Bid, Buy, and Sell with Confidence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join our secure marketplace where buyers and sellers connect through customizable auctions with
                  enhanced safety features.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auctions">
                    <Button size="lg">Browse Auctions</Button>
                  </Link>
                  <Link href="/sell">
                    <Button variant="outline" size="lg">
                      Start Selling
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Auction marketplace illustration"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Auctions */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Auctions</h2>
                <p className="text-muted-foreground">Discover unique items with active bidding</p>
              </div>
              <Link href="/auctions" className="mt-4 md:mt-0">
                <Button variant="outline">View All Auctions</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAuctions.map((auction) => (
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
                        <Badge className="font-medium">
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
          </div>
        </section>

        {/* Categories */}
        <section className="w-full py-12 md:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link href={`/categories/${category.name.toLowerCase()}`} key={category.name}>
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl mb-2">{category.icon}</span>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} items</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How BidMarket Works</h2>
              <p className="text-muted-foreground mt-2 max-w-[700px] mx-auto">
                Our marketplace is designed to provide a safe and flexible bidding experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Safe & Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    User verification, escrow payments, and our dispute resolution center ensure safe transactions.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Flexible Auctions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose from multiple auction types including classic, buy it now, reserve price, and time-extended.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Rewards & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Earn points for successful transactions that can be redeemed for discounts and special perks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4">Ready to Start Bidding?</h2>
            <p className="max-w-[600px] mx-auto mb-8">
              Join thousands of users who buy and sell on BidMarket every day. Registration is free and only takes a
              minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Create an Account
                </Button>
              </Link>
              <Link href="/auctions">
                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Browse Auctions
                </Button>
              </Link>
            </div>
          </div>
        </section>
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


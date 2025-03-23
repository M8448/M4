"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Bell,
  LogOut,
  Package,
  Clock,
  DollarSign,
  ShoppingCart,
  Heart,
  Settings,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("buying")

  // Sample user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    memberSince: "March 2023",
    rating: 4.9,
    verified: true,
    balance: 450.75,
    points: 320,
    tier: "Gold",
  }

  // Sample buying activity
  const biddingActivity = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 120,
      yourBid: 115,
      timeLeft: "2 days, 5 hours",
      status: "outbid",
      auctionType: "Classic",
    },
    {
      id: 2,
      title: "Professional DSLR Camera",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 550,
      yourBid: 550,
      timeLeft: "1 day, 3 hours",
      status: "winning",
      auctionType: "Reserve",
    },
    {
      id: 3,
      title: "Handcrafted Wooden Desk",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 320,
      yourBid: 320,
      timeLeft: "4 days, 12 hours",
      status: "winning",
      auctionType: "Time-Extended",
    },
  ]

  // Sample watchlist
  const watchlist = [
    {
      id: 4,
      title: "Rare Vinyl Record Collection",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 180,
      timeLeft: "6 hours, 45 minutes",
      bids: 15,
      auctionType: "Buy It Now",
    },
    {
      id: 5,
      title: "Antique Pocket Watch",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 95,
      timeLeft: "3 days, 8 hours",
      bids: 7,
      auctionType: "Classic",
    },
  ]

  // Sample selling activity
  const sellingActivity = [
    {
      id: 6,
      title: "Mountain Bike - Premium Model",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 420,
      timeLeft: "5 days, 2 hours",
      bids: 9,
      status: "active",
      auctionType: "Reserve",
    },
    {
      id: 7,
      title: "Designer Handbag - Limited Edition",
      image: "/placeholder.svg?height=80&width=80",
      currentBid: 780,
      timeLeft: "1 day, 15 hours",
      bids: 22,
      status: "active",
      auctionType: "Time-Extended",
    },
    {
      id: 8,
      title: "Smart Home Security System",
      image: "/placeholder.svg?height=80&width=80",
      soldPrice: 350,
      soldDate: "2 days ago",
      status: "sold",
      auctionType: "Buy It Now",
    },
  ]

  // Sample recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: "purchase",
      title: "Vintage Camera",
      amount: 235.5,
      date: "May 15, 2023",
    },
    {
      id: 2,
      type: "sale",
      title: "Antique Vase",
      amount: 180.0,
      date: "May 10, 2023",
    },
    {
      id: 3,
      type: "deposit",
      amount: 500.0,
      date: "May 5, 2023",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 150.0,
      date: "May 1, 2023",
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
            <Link href="/auctions" className="text-sm font-medium transition-colors hover:text-primary">
              Browse Auctions
            </Link>
            <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
              Sell an Item
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-primary transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline-block font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-2">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium">{user.name}</h3>
                        {user.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>{user.rating}</span>
                      </div>
                      <Badge className="mt-2">{user.tier} Member</Badge>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-muted-foreground">Available Balance</span>
                        <span className="font-medium">${user.balance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-muted-foreground">Reward Points</span>
                        <span className="font-medium">{user.points} pts</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-muted-foreground">Member Since</span>
                        <span className="font-medium">{user.memberSince}</span>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add Funds
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <nav className="flex flex-col">
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors border-l-2 border-primary"
                      >
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-3" />
                          <span>Dashboard</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/dashboard/buying"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-3" />
                          <span>My Purchases</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/dashboard/selling"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-3" />
                          <span>My Sales</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/dashboard/watchlist"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-3" />
                          <span>Watchlist</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-3" />
                          <span>Settings</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/"
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-3" />
                          <span>Logout</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Bids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{biddingActivity.length}</div>
                    <p className="text-xs text-muted-foreground">
                      You're winning {biddingActivity.filter((item) => item.status === "winning").length} auctions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sellingActivity.filter((item) => item.status === "active").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sellingActivity.filter((item) => item.status === "sold").length} items sold this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{watchlist.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {watchlist.filter((item) => item.timeLeft.includes("hours")).length} ending soon
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="buying" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="buying">My Buying Activity</TabsTrigger>
                  <TabsTrigger value="selling">My Selling Activity</TabsTrigger>
                  <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                </TabsList>

                <TabsContent value="buying" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Current Bids</h3>
                    <Link href="/dashboard/buying">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>

                  {biddingActivity.length > 0 ? (
                    <div className="space-y-4">
                      {biddingActivity.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                  <div>
                                    <Link
                                      href={`/auctions/${item.id}`}
                                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                                    >
                                      {item.title}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs font-normal">
                                        {item.auctionType}
                                      </Badge>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {item.timeLeft}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="text-sm font-medium">
                                      Current Bid: <span className="font-bold">${item.currentBid.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm">
                                      Your Bid:{" "}
                                      <span
                                        className={
                                          item.status === "winning"
                                            ? "text-green-500 font-medium"
                                            : "text-destructive font-medium"
                                        }
                                      >
                                        ${item.yourBid.toFixed(2)}
                                      </span>
                                    </div>
                                    <Badge className={item.status === "winning" ? "bg-green-500" : "bg-destructive"}>
                                      {item.status === "winning" ? "Winning" : "Outbid"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                              <Button variant="outline" size="sm">
                                <Link href={`/auctions/${item.id}`}>View Auction</Link>
                              </Button>
                              {item.status === "outbid" && (
                                <Button size="sm">
                                  <Link href={`/auctions/${item.id}`}>Bid Again</Link>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">You don't have any active bids at the moment.</p>
                        <Button>
                          <Link href="/auctions">Browse Auctions</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recent Purchases</h3>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                        <Button>
                          <Link href="/auctions">Browse Auctions</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="selling" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Active Listings</h3>
                    <Link href="/dashboard/selling">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>

                  {sellingActivity.filter((item) => item.status === "active").length > 0 ? (
                    <div className="space-y-4">
                      {sellingActivity
                        .filter((item) => item.status === "active")
                        .map((item) => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                      <Link
                                        href={`/auctions/${item.id}`}
                                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                                      >
                                        {item.title}
                                      </Link>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs font-normal">
                                          {item.auctionType}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {item.timeLeft}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="text-sm font-medium">
                                        Current Bid: <span className="font-bold">${item.currentBid.toFixed(2)}</span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">{item.bids} bids</div>
                                      <Badge>Active</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" size="sm">
                                  <Link href={`/auctions/${item.id}`}>View Auction</Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  Edit Listing
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">You don't have any active listings at the moment.</p>
                        <Button>
                          <Link href="/sell">Create Listing</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Sold Items</h3>
                    {sellingActivity.filter((item) => item.status === "sold").length > 0 ? (
                      <div className="space-y-4">
                        {sellingActivity
                          .filter((item) => item.status === "sold")
                          .map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.title}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                      <div>
                                        <Link
                                          href={`/auctions/${item.id}`}
                                          className="font-medium hover:text-primary transition-colors line-clamp-1"
                                        >
                                          {item.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs font-normal">
                                            {item.auctionType}
                                          </Badge>
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            Sold {item.soldDate}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <div className="text-sm font-medium">
                                          Sold for: <span className="font-bold">${item.soldPrice.toFixed(2)}</span>
                                        </div>
                                        <Badge className="bg-green-500">Sold</Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">You haven't sold any items yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="watchlist" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Items You're Watching</h3>
                    <Link href="/dashboard/watchlist">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>

                  {watchlist.length > 0 ? (
                    <div className="space-y-4">
                      {watchlist.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                  <div>
                                    <Link
                                      href={`/auctions/${item.id}`}
                                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                                    >
                                      {item.title}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs font-normal">
                                        {item.auctionType}
                                      </Badge>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {item.timeLeft}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="text-sm font-medium">
                                      Current Bid: <span className="font-bold">${item.currentBid.toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.bids} bids</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                              <Button variant="outline" size="sm">
                                <Link href={`/auctions/${item.id}`}>View Auction</Link>
                              </Button>
                              <Button size="sm">
                                <Link href={`/auctions/${item.id}`}>Place Bid</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">Your watchlist is empty.</p>
                        <Button>
                          <Link href="/auctions">Browse Auctions</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent financial activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                transaction.type === "purchase"
                                  ? "bg-blue-100 text-blue-600"
                                  : transaction.type === "sale"
                                    ? "bg-green-100 text-green-600"
                                    : transaction.type === "deposit"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.type === "purchase" ? (
                                <ShoppingCart className="h-4 w-4" />
                              ) : transaction.type === "sale" ? (
                                <DollarSign className="h-4 w-4" />
                              ) : transaction.type === "deposit" ? (
                                <DollarSign className="h-4 w-4" />
                              ) : (
                                <DollarSign className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.type === "purchase"
                                  ? `Purchased ${transaction.title}`
                                  : transaction.type === "sale"
                                    ? `Sold ${transaction.title}`
                                    : transaction.type === "deposit"
                                      ? "Account Deposit"
                                      : "Account Withdrawal"}
                              </p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div
                            className={`font-medium ${
                              transaction.type === "purchase" || transaction.type === "withdrawal"
                                ? "text-destructive"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "purchase" || transaction.type === "withdrawal" ? "-" : "+"}$
                            {transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No recent transactions.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
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


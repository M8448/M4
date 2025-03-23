"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, Upload, Info, AlertCircle, Clock, DollarSign, Shield } from "lucide-react"

export default function SellPage() {
  const [images, setImages] = useState<string[]>(["/placeholder.svg?height=200&width=300"])
  const [auctionType, setAuctionType] = useState("classic")
  const [formStep, setFormStep] = useState(1)

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, "/placeholder.svg?height=200&width=300"])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleNextStep = () => {
    setFormStep(formStep + 1)
  }

  const handlePrevStep = () => {
    setFormStep(formStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit form logic
    alert("Your listing has been created successfully!")
    // Redirect to dashboard
    window.location.href = "/dashboard"
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
            <Link href="/sell" className="text-sm font-medium text-primary transition-colors">
              Sell an Item
            </Link>
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>
                My Account
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create a Listing</h1>
            <p className="text-muted-foreground">List your item for auction or immediate sale</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Listing Details</CardTitle>
                    <div className="text-sm text-muted-foreground">Step {formStep} of 3</div>
                  </div>
                  <CardDescription>
                    {formStep === 1
                      ? "Add photos and basic information about your item"
                      : formStep === 2
                        ? "Set your pricing and auction preferences"
                        : "Review your listing and submit"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    {formStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Item Title</Label>
                          <Input id="title" placeholder="Enter a descriptive title" required />
                          <p className="text-xs text-muted-foreground">
                            Be specific and include brand, model, size, or other key details
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Item Photos</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative">
                                <div className="border rounded-md overflow-hidden aspect-square">
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`Item photo ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  className="absolute top-2 right-2"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                            {images.length < 5 && (
                              <Button
                                type="button"
                                className="border-dashed h-full min-h-[150px] flex flex-col items-center justify-center"
                                onClick={handleAddImage}
                              >
                                <Upload className="h-6 w-6 mb-2" />
                                <span>Add Photo</span>
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Add up to 5 photos. The first photo will be your listing's thumbnail.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Item Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your item in detail"
                            className="min-h-[150px]"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Include condition, features, flaws, history, and any other relevant details
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select required>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="collectibles">Collectibles</SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="home">Home & Garden</SelectItem>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="vehicles">Vehicles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select required>
                              <SelectTrigger id="condition">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="like-new">Like New</SelectItem>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="for-parts">For Parts/Not Working</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Auction Type</Label>
                          <RadioGroup defaultValue="classic" onValueChange={setAuctionType}>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <RadioGroupItem value="classic" id="classic" className="mt-1" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="classic" className="font-medium">
                                  Classic Auction
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Standard bidding process where the highest bidder wins when the auction ends
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <RadioGroupItem value="buy-now" id="buy-now" className="mt-1" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="buy-now" className="font-medium">
                                  Buy It Now with Bidding
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Allows buyers to purchase immediately at a set price or place bids
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <RadioGroupItem value="reserve" id="reserve" className="mt-1" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="reserve" className="font-medium">
                                  Reserve Price Auction
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Set a minimum price that must be met for the item to sell
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <RadioGroupItem value="time-extended" id="time-extended" className="mt-1" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="time-extended" className="font-medium">
                                  Time-Extended Auction
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Adds time if bids are placed near the end to prevent last-second bidding
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="starting-price">Starting Price</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                $
                              </span>
                              <Input
                                id="starting-price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                className="rounded-l-none"
                                required
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">The minimum amount bidding will start at</p>
                          </div>

                          {(auctionType === "buy-now" || auctionType === "reserve") && (
                            <div className="space-y-2">
                              <Label htmlFor="buy-now-price">
                                {auctionType === "buy-now" ? "Buy It Now Price" : "Reserve Price"}
                              </Label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  id="buy-now-price"
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="rounded-l-none"
                                  required
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {auctionType === "buy-now"
                                  ? "The price at which buyers can purchase immediately"
                                  : "The minimum price that must be met for the item to sell"}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="duration">Auction Duration</Label>
                            <Select required>
                              <SelectTrigger id="duration">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="3">3 days</SelectItem>
                                <SelectItem value="5">5 days</SelectItem>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="10">10 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bid-increment">Minimum Bid Increment</Label>
                            <Select required>
                              <SelectTrigger id="bid-increment">
                                <SelectValue placeholder="Select increment" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">$1.00</SelectItem>
                                <SelectItem value="5">$5.00</SelectItem>
                                <SelectItem value="10">$10.00</SelectItem>
                                <SelectItem value="25">$25.00</SelectItem>
                                <SelectItem value="50">$50.00</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Shipping Options</Label>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <Checkbox id="standard-shipping" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="standard-shipping" className="font-medium">
                                  Standard Shipping
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" min="0" step="0.01" placeholder="Cost" className="w-24" />
                                  <span className="text-sm text-muted-foreground">5-7 business days</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <Checkbox id="express-shipping" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="express-shipping" className="font-medium">
                                  Express Shipping
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" min="0" step="0.01" placeholder="Cost" className="w-24" />
                                  <span className="text-sm text-muted-foreground">2-3 business days</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 p-4 border rounded-md">
                              <Checkbox id="local-pickup" />
                              <div className="grid gap-1.5">
                                <Label htmlFor="local-pickup" className="font-medium">
                                  Local Pickup
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Allow buyers to pick up the item in person
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formStep === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Review Your Listing</h3>
                          <p className="text-sm text-muted-foreground">
                            Please review your listing details before submitting
                          </p>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="p-4 bg-muted">
                            <h4 className="font-medium">Item Details</h4>
                          </div>
                          <div className="p-4 grid gap-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Image
                                  src="/placeholder.svg?height=200&width=300"
                                  alt="Item preview"
                                  width={300}
                                  height={200}
                                  className="w-full h-auto rounded-md"
                                />
                              </div>
                              <div className="col-span-2">
                                <h5 className="font-medium text-lg">Vintage Leather Jacket</h5>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  This authentic vintage leather jacket is crafted from premium cowhide leather.
                                  Features a classic design with zippered front, two side pockets, and one interior
                                  pocket.
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge>Fashion</Badge>
                                  <Badge>Excellent Condition</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="p-4 bg-muted">
                            <h4 className="font-medium">Auction Details</h4>
                          </div>
                          <div className="p-4 grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Auction Type</p>
                                <p className="font-medium">
                                  {auctionType === "classic"
                                    ? "Classic Auction"
                                    : auctionType === "buy-now"
                                      ? "Buy It Now with Bidding"
                                      : auctionType === "reserve"
                                        ? "Reserve Price Auction"
                                        : "Time-Extended Auction"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Starting Price</p>
                                <p className="font-medium">$99.00</p>
                              </div>
                              {(auctionType === "buy-now" || auctionType === "reserve") && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    {auctionType === "buy-now" ? "Buy It Now Price" : "Reserve Price"}
                                  </p>
                                  <p className="font-medium">$199.00</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">7 days</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Bid Increment</p>
                                <p className="font-medium">$5.00</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <div className="p-4 bg-muted">
                            <h4 className="font-medium">Shipping Options</h4>
                          </div>
                          <div className="p-4 grid gap-2">
                            <div className="flex justify-between">
                              <p>Standard Shipping</p>
                              <p className="font-medium">$12.00</p>
                            </div>
                            <div className="flex justify-between">
                              <p>Express Shipping</p>
                              <p className="font-medium">$25.00</p>
                            </div>
                            <div className="flex justify-between">
                              <p>Local Pickup</p>
                              <p className="font-medium">Available</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" required />
                          <div className="grid gap-1.5">
                            <Label htmlFor="terms" className="font-medium">
                              I agree to the Terms and Conditions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              By creating this listing, you agree to our{" "}
                              <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/seller-policy" className="text-primary hover:underline">
                                Seller Policy
                              </Link>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {formStep > 1 ? (
                    <Button type="button" onClick={handlePrevStep}>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {formStep < 3 ? (
                    <Button type="button" onClick={handleNextStep}>
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" onClick={handleSubmit}>
                      Create Listing
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Use clear photos.</span> Take photos in good lighting from multiple
                      angles.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Be detailed.</span> Include dimensions, materials, age, and any
                      flaws.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Price competitively.</span> Research similar items to set a fair
                      price.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Choose the right auction type.</span> Different formats work better
                      for different items.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auction Types Explained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Classic Auction</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Traditional bidding where the highest bidder wins when the auction ends. Best for items with
                      uncertain value or high demand.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Buy It Now</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allows immediate purchase at a set price while also accepting bids. Good for items you want to
                      sell quickly.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Reserve Price</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sets a hidden minimum price that must be met. Protects valuable items from selling too low.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Time-Extended</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Adds time when bids are placed near the end. Prevents last-second "sniping" and maximizes final
                      price.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seller Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      BidMarket offers seller protection to ensure safe transactions. Learn more about our{" "}
                      <Link href="/seller-protection" className="text-primary hover:underline">
                        Seller Protection Program
                      </Link>
                      .
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">
                      Need help? Contact our{" "}
                      <Link href="/help" className="text-primary hover:underline">
                        Seller Support Team
                      </Link>{" "}
                      for assistance with your listing.
                    </p>
                  </div>
                </CardContent>
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


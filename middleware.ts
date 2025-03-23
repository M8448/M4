import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes require authentication
const protectedRoutes = ["/dashboard", "/sell", "/auctions/create"]

// Define which routes are for non-authenticated users only
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value
  const path = request.nextUrl.pathname

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Check if the route is for non-authenticated users only
  const isAuthRoute = authRoutes.some((route) => path === route)

  // If the route requires authentication and the user is not authenticated
  if (isProtectedRoute && !userId) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // If the route is for non-authenticated users only and the user is authenticated
  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/sell/:path*", "/auctions/create", "/login", "/register"],
}


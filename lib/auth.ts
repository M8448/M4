"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserByEmail, createUser, getUserById } from "@/app/actions/user-actions"
import type { User } from "./types"

// In a real app, you would use a proper password hashing library
function hashPassword(password: string): string {
  return password // This is just a placeholder, DO NOT use in production
}

// Register a new user
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }

    // Create the user
    const user = await createUser({
      name,
      email,
      password: hashPassword(password),
      memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      rating: 0,
      verified: false,
      balance: 0,
      points: 0,
      tier: "Bronze",
    })

    if (!user) {
      return { success: false, message: "Failed to create user" }
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, message: "Registration successful", user }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}

// Login a user
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Get the user
    const user = await getUserByEmail(email)
    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check password
    if (user.password !== hashPassword(password)) {
      return { success: false, message: "Invalid email or password" }
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, message: "Login successful", user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

// Logout a user
export async function logout(): Promise<void> {
  cookies().delete("userId")
  redirect("/login")
}

// Get the current user
export async function getCurrentUser(): Promise<User | null> {
  const userId = cookies().get("userId")?.value
  if (!userId) return null

  return await getUserById(userId)
}

// Check if user is authenticated
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}


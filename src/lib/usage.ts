import { auth } from "@clerk/nextjs/server"
import { RateLimiterSQLite } from "rate-limiter-flexible"
import Database from "better-sqlite3"

const FREE_POINTS = 2
const PRO_POINTS = 100
const DURATION = 30 * 24 * 60 * 60 // 30 days
const GENERATION_COST = 1

export async function getUsageTracker() {
  const { has } = await auth()
  const hasPremiumAccess = has({ plan: "pro" })

  const db = new Database(process.env.DB_FILE_NAME!, {
    fileMustExist: true,
  })

  const usageTracker = new RateLimiterSQLite({
    storeClient: db,
    storeType: "better-sqlite3",
    tableName: "vibe_usage",
    tableCreated: true,
    points: hasPremiumAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  })
  return usageTracker
}

export async function consumeCredits() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("User not authenticated")
  }
  const usageTracker = await getUsageTracker()
  const result = await usageTracker.consume(userId, GENERATION_COST)
  return result
}

export async function getUsageStatus() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("User not authenticated")
  }
  const usageTracker = await getUsageTracker()
  const result = await usageTracker.get(userId)
  return result
}

import { db } from "./db";
import { services, users } from "@shared/schema";

const initialServices = [
  // Instagram Services
  {
    platform: "instagram" as const,
    name: "Instagram Followers",
    description: "High-quality Instagram followers from real accounts",
    pricePerThousand: "2.50",
    minQuantity: 100,
    maxQuantity: 100000,
    eta: "30 min - 2 hrs",
    isActive: 1,
  },
  {
    platform: "instagram" as const,
    name: "Instagram Likes",
    description: "Instant Instagram post likes",
    pricePerThousand: "0.50",
    minQuantity: 100,
    maxQuantity: 50000,
    eta: "Instant - 1 hr",
    isActive: 1,
  },
  {
    platform: "instagram" as const,
    name: "Instagram Reels Views",
    description: "Boost your Instagram Reels with real views",
    pricePerThousand: "0.80",
    minQuantity: 1000,
    maxQuantity: 1000000,
    eta: "30 min - 6 hrs",
    isActive: 1,
  },
  
  // YouTube Services
  {
    platform: "youtube" as const,
    name: "YouTube Views",
    description: "Real YouTube video views from active users",
    pricePerThousand: "3.00",
    minQuantity: 500,
    maxQuantity: 500000,
    eta: "2 hrs - 12 hrs",
    isActive: 1,
  },
  {
    platform: "youtube" as const,
    name: "YouTube Likes",
    description: "Genuine YouTube video likes",
    pricePerThousand: "4.50",
    minQuantity: 100,
    maxQuantity: 50000,
    eta: "1 hr - 6 hrs",
    isActive: 1,
  },
  {
    platform: "youtube" as const,
    name: "YouTube Subscribers",
    description: "Grow your YouTube channel with real subscribers",
    pricePerThousand: "15.00",
    minQuantity: 100,
    maxQuantity: 10000,
    eta: "6 hrs - 24 hrs",
    isActive: 1,
  },
  
  // Facebook Services
  {
    platform: "facebook" as const,
    name: "Facebook Page Likes",
    description: "Increase your Facebook page likes",
    pricePerThousand: "2.00",
    minQuantity: 100,
    maxQuantity: 50000,
    eta: "1 hr - 8 hrs",
    isActive: 1,
  },
  {
    platform: "facebook" as const,
    name: "Facebook Post Reactions",
    description: "Get reactions on your Facebook posts",
    pricePerThousand: "1.50",
    minQuantity: 100,
    maxQuantity: 20000,
    eta: "30 min - 4 hrs",
    isActive: 1,
  },
  
  // Twitter/X Services
  {
    platform: "twitter" as const,
    name: "Twitter/X Followers",
    description: "Grow your Twitter following organically",
    pricePerThousand: "3.50",
    minQuantity: 100,
    maxQuantity: 50000,
    eta: "1 hr - 6 hrs",
    isActive: 1,
  },
  {
    platform: "twitter" as const,
    name: "Twitter/X Likes",
    description: "Boost engagement with Twitter likes",
    pricePerThousand: "1.00",
    minQuantity: 100,
    maxQuantity: 20000,
    eta: "Instant - 2 hrs",
    isActive: 1,
  },
  
  // Telegram Services
  {
    platform: "telegram" as const,
    name: "Telegram Channel Members",
    description: "Grow your Telegram channel membership",
    pricePerThousand: "1.00",
    minQuantity: 100,
    maxQuantity: 100000,
    eta: "Instant - 2 hrs",
    isActive: 1,
  },
  
  // TikTok Services
  {
    platform: "tiktok" as const,
    name: "TikTok Followers",
    description: "Increase your TikTok followers",
    pricePerThousand: "2.80",
    minQuantity: 100,
    maxQuantity: 50000,
    eta: "1 hr - 6 hrs",
    isActive: 1,
  },
  {
    platform: "tiktok" as const,
    name: "TikTok Likes",
    description: "Get more likes on your TikTok videos",
    pricePerThousand: "0.70",
    minQuantity: 100,
    maxQuantity: 100000,
    eta: "30 min - 4 hrs",
    isActive: 1,
  },
];

async function seed() {
  console.log("Seeding database...");
  
  // Create admin user
  console.log("\nCreating admin user...");
  try {
    await db.insert(users).values({
      id: "admin-user-1",
      email: "admin@reelboost.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      walletBalance: "1000.00",
      referralCode: "ADMIN2025",
    });
    console.log("✓ Admin user created (ID: admin-user-1, Email: admin@reelboost.com)");
  } catch (error: any) {
    if (error.code === '23505') {
      console.log("- Admin user already exists");
    } else {
      console.error("✗ Error creating admin user:", error.message);
    }
  }

  // Seed services
  console.log("\nSeeding services...");
  for (const service of initialServices) {
    try {
      await db.insert(services).values(service);
      console.log(`✓ Added: ${service.name}`);
    } catch (error: any) {
      if (error.code === '23505') {
        console.log(`- Skipped (already exists): ${service.name}`);
      } else {
        console.error(`✗ Error adding ${service.name}:`, error.message);
      }
    }
  }
  
  console.log("\nSeeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

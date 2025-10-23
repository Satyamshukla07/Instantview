// MongoDB connection using Mongoose
import mongoose from 'mongoose';

let isConnected = false;

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://smmpanel:smmpanelpassword@smmcluster.ltlnh0v.mongodb.net/reelboost?retryWrites=true&w=majority';

// Connect to MongoDB
export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    if (!MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI not set. Database features will be disabled.");
      return;
    }

    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// Re-export all models from server/models.ts
export {
  UserModel,
  ServiceModel,
  OrderModel,
  TransactionModel,
  ReferralModel,
  PaymentProofModel,
  ConsentLogModel,
  SessionModel,
} from './models';

// Export mongoose connection for use in other modules
export { mongoose };

// Legacy exports for compatibility (will be null if MongoDB not configured)
export const db = null;
export const pool = null;

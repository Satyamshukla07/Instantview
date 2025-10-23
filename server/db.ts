// MongoDB connection using Mongoose
import mongoose from 'mongoose';
import { schemas } from '@shared/schema';

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

// Create Mongoose models
export const UserModel = mongoose.models.User || mongoose.model('User', schemas.user);
export const ServiceModel = mongoose.models.Service || mongoose.model('Service', schemas.service);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', schemas.order);
export const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', schemas.transaction);
export const ReferralModel = mongoose.models.Referral || mongoose.model('Referral', schemas.referral);
export const PaymentProofModel = mongoose.models.PaymentProof || mongoose.model('PaymentProof', schemas.paymentProof);
export const ConsentLogModel = mongoose.models.ConsentLog || mongoose.model('ConsentLog', schemas.consentLog);
export const SessionModel = mongoose.models.Session || mongoose.model('Session', schemas.session);

// Export mongoose connection for use in other modules
export { mongoose };

// Legacy exports for compatibility (will be null if MongoDB not configured)
export const db = null;
export const pool = null;

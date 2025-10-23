// ReelBoost MongoDB Schema - Mongoose Models
import { Schema, Document } from "mongoose";
import { z } from "zod";
import { randomBytes } from "crypto";

// ===== ENUMS =====
export const UserRole = {
  USER: "user",
  RESELLER: "reseller",
  ADMIN: "admin",
} as const;

export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const TransactionType = {
  DEPOSIT: "deposit",
  ORDER: "order",
  REFUND: "refund",
  REFERRAL_COMMISSION: "referral_commission",
} as const;

export const Platform = {
  INSTAGRAM: "instagram",
  YOUTUBE: "youtube",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  TELEGRAM: "telegram",
  TIKTOK: "tiktok",
} as const;

export const PaymentProofStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const AuthProvider = {
  LOCAL: "local",
  GOOGLE: "google",
} as const;

// ===== TYPE DEFINITIONS =====
export type UserRoleType = typeof UserRole[keyof typeof UserRole];
export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];
export type TransactionTypeType = typeof TransactionType[keyof typeof TransactionType];
export type PlatformType = typeof Platform[keyof typeof Platform];
export type PaymentProofStatusType = typeof PaymentProofStatus[keyof typeof PaymentProofStatus];
export type AuthProviderType = typeof AuthProvider[keyof typeof AuthProvider];

// Helper to generate UUID
const generateUUID = () => randomBytes(16).toString('hex');

// ===== MONGOOSE SCHEMAS =====

// User Schema - using custom string _id
const userSchema = new Schema({
  _id: { type: String },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, default: null },
  authProvider: { type: String, enum: Object.values(AuthProvider), default: AuthProvider.LOCAL },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  profileImageUrl: { type: String, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  walletBalance: { type: Number, default: 0.00 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: String, default: null },
  apiKey: { type: String, unique: true, sparse: true },
  apiKeyEnabled: { type: Number, default: 0 },
  resellerMarkup: { type: Number, default: 0.00 },
  totalEarnings: { type: Number, default: 0.00 },
}, {
  timestamps: true,
  collection: 'users'
});

// Service Schema
const serviceSchema = new Schema({
  _id: { type: String },
  platform: { type: String, enum: Object.values(Platform), required: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  pricePerThousand: { type: Number, required: true },
  minQuantity: { type: Number, default: 100 },
  maxQuantity: { type: Number, default: 1000000 },
  eta: { type: String, default: null },
  isActive: { type: Number, default: 1 },
  supplierServiceId: { type: String, default: null },
}, {
  timestamps: true,
  collection: 'services'
});

// Order Schema
const orderSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, ref: 'User' },
  serviceId: { type: String, required: true, ref: 'Service' },
  targetLink: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  supplierOrderId: { type: String, default: null },
  startCount: { type: Number, default: null },
  remainingCount: { type: Number, default: null },
}, {
  timestamps: true,
  collection: 'orders'
});

// Transaction Schema
const transactionSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, enum: Object.values(TransactionType), required: true },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  description: { type: String, default: null },
  orderId: { type: String, ref: 'Order', default: null },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'transactions'
});

// Referral Schema
const referralSchema = new Schema({
  _id: { type: String },
  referrerId: { type: String, required: true, ref: 'User' },
  referredUserId: { type: String, required: true, ref: 'User' },
  commissionEarned: { type: Number, default: 0.00 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'referrals'
});

// Payment Proof Schema
const paymentProofSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  utrNumber: { type: String, default: null },
  screenshotUrl: { type: String, default: null },
  status: { type: String, enum: Object.values(PaymentProofStatus), default: PaymentProofStatus.PENDING },
  adminNotes: { type: String, default: null },
}, {
  timestamps: true,
  collection: 'payment_proofs'
});

// Consent Log Schema
const consentLogSchema = new Schema({
  _id: { type: String },
  userId: { type: String, ref: 'User', default: null },
  ipAddress: { type: String, default: null },
  consentVersion: { type: String, default: "v1.0" },
  orderId: { type: String, ref: 'Order', default: null },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'consent_logs'
});

// Session Schema (for express-session with MongoDB store)
const sessionSchema = new Schema({
  _id: String,
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true },
}, {
  collection: 'sessions'
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
transactionSchema.index({ userId: 1 });
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredUserId: 1 });
paymentProofSchema.index({ userId: 1 });
paymentProofSchema.index({ status: 1 });
consentLogSchema.index({ userId: 1 });
consentLogSchema.index({ orderId: 1 });
sessionSchema.index({ expire: 1 });

// ===== TypeScript INTERFACES =====
// Note: Using 'id' as alias for backward compatibility with existing code
export interface User extends Document {
  _id: string;
  id: string;  // Virtual getter for _id
  email: string | null;
  passwordHash: string | null;
  authProvider: AuthProviderType;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: UserRoleType;
  walletBalance: number;
  referralCode: string | null;
  referredBy: string | null;
  apiKey: string | null;
  apiKeyEnabled: number;
  resellerMarkup: number;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service extends Document {
  _id: string;
  id: string;
  platform: PlatformType;
  name: string;
  description: string | null;
  pricePerThousand: number;
  minQuantity: number;
  maxQuantity: number;
  eta: string | null;
  isActive: number;
  supplierServiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order extends Document {
  _id: string;
  id: string;
  userId: string;
  serviceId: string;
  targetLink: string;
  quantity: number;
  amount: number;
  status: OrderStatusType;
  supplierOrderId: string | null;
  startCount: number | null;
  remainingCount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction extends Document {
  _id: string;
  id: string;
  userId: string;
  type: TransactionTypeType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  orderId: string | null;
  createdAt: Date;
}

export interface Referral extends Document {
  _id: string;
  id: string;
  referrerId: string;
  referredUserId: string;
  commissionEarned: number;
  createdAt: Date;
}

export interface PaymentProof extends Document {
  _id: string;
  id: string;
  userId: string;
  amount: number;
  utrNumber: string | null;
  screenshotUrl: string | null;
  status: PaymentProofStatusType;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentLog extends Document {
  _id: string;
  id: string;
  userId: string | null;
  ipAddress: string | null;
  consentVersion: string;
  orderId: string | null;
  createdAt: Date;
}

// Add virtual 'id' getters for all schemas (backward compatibility)
userSchema.virtual('id').get(function(this: any) { return this._id; });
serviceSchema.virtual('id').get(function(this: any) { return this._id; });
orderSchema.virtual('id').get(function(this: any) { return this._id; });
transactionSchema.virtual('id').get(function(this: any) { return this._id; });
referralSchema.virtual('id').get(function(this: any) { return this._id; });
paymentProofSchema.virtual('id').get(function(this: any) { return this._id; });
consentLogSchema.virtual('id').get(function(this: any) { return this._id; });

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toJSON', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toJSON', { virtuals: true });
referralSchema.set('toJSON', { virtuals: true });
paymentProofSchema.set('toJSON', { virtuals: true });
consentLogSchema.set('toJSON', { virtuals: true });

// ===== ZOD VALIDATION SCHEMAS =====
export const upsertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  authProvider: z.enum([AuthProvider.LOCAL, AuthProvider.GOOGLE]).optional(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().url().optional().nullable(),
  role: z.enum([UserRole.USER, UserRole.RESELLER, UserRole.ADMIN]).optional(),
  walletBalance: z.number().optional(),
  referralCode: z.string().optional().nullable(),
  referredBy: z.string().optional().nullable(),
  apiKey: z.string().optional().nullable(),
  apiKeyEnabled: z.number().optional(),
  resellerMarkup: z.number().optional(),
  totalEarnings: z.number().optional(),
});

export const insertServiceSchema = z.object({
  platform: z.enum([Platform.INSTAGRAM, Platform.YOUTUBE, Platform.FACEBOOK, Platform.TWITTER, Platform.TELEGRAM, Platform.TIKTOK]),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  pricePerThousand: z.number().positive(),
  minQuantity: z.number().int().positive().optional(),
  maxQuantity: z.number().int().positive().optional(),
  eta: z.string().optional().nullable(),
  isActive: z.number().int().min(0).max(1).optional(),
  supplierServiceId: z.string().optional().nullable(),
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  serviceId: z.string(),
  targetLink: z.string().url(),
  quantity: z.number().int().positive(),
  amount: z.number().positive(),
});

export const insertTransactionSchema = z.object({
  userId: z.string(),
  type: z.enum([TransactionType.DEPOSIT, TransactionType.ORDER, TransactionType.REFUND, TransactionType.REFERRAL_COMMISSION]),
  amount: z.number(),
  balanceBefore: z.number(),
  balanceAfter: z.number(),
  description: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
});

export const insertReferralSchema = z.object({
  referrerId: z.string(),
  referredUserId: z.string(),
  commissionEarned: z.number().optional(),
});

export const insertPaymentProofSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  utrNumber: z.string().optional().nullable(),
  screenshotUrl: z.string().optional().nullable(),
});

export const insertConsentLogSchema = z.object({
  userId: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  consentVersion: z.string().optional(),
  orderId: z.string().optional().nullable(),
});

// Export schema objects for creating models
export const schemas = {
  user: userSchema,
  service: serviceSchema,
  order: orderSchema,
  transaction: transactionSchema,
  referral: referralSchema,
  paymentProof: paymentProofSchema,
  consentLog: consentLogSchema,
  session: sessionSchema,
};

// Helper function to generate IDs (exported for use in storage layer)
export { generateUUID };

// ===== INPUT/INSERT TYPES =====
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type InsertPaymentProof = z.infer<typeof insertPaymentProofSchema>;
export type InsertConsentLog = z.infer<typeof insertConsentLogSchema>;

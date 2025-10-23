// Shared Types - Client and Server safe (NO Mongoose dependencies)
import { z } from "zod";

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

// ===== INPUT/INSERT TYPES =====
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type InsertPaymentProof = z.infer<typeof insertPaymentProofSchema>;
export type InsertConsentLog = z.infer<typeof insertConsentLogSchema>;

// ===== PLAIN TYPESCRIPT INTERFACES (NO Document extension) =====
// These are plain data structures that work in both client and server
export interface User {
  _id: string;
  id: string;
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

export interface Service {
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

export interface Order {
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

export interface Transaction {
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

export interface Referral {
  _id: string;
  id: string;
  referrerId: string;
  referredUserId: string;
  commissionEarned: number;
  createdAt: Date;
}

export interface PaymentProof {
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

export interface ConsentLog {
  _id: string;
  id: string;
  userId: string | null;
  ipAddress: string | null;
  consentVersion: string;
  orderId: string | null;
  createdAt: Date;
}

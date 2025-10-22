// ReelBoost Database Schema - Referenced from javascript_database and javascript_log_in_with_replit blueprints
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  index,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (Required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["user", "reseller", "admin"]);

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
]);

// Transaction type enum
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "order",
  "refund",
  "referral_commission",
]);

// Platform enum
export const platformEnum = pgEnum("platform", [
  "instagram",
  "youtube",
  "facebook",
  "twitter",
  "telegram",
  "tiktok",
]);

// Payment proof status enum
export const paymentProofStatusEnum = pgEnum("payment_proof_status", [
  "pending",
  "approved",
  "rejected",
]);

// Users table (Extended for email/password auth + SMM Panel)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("user").notNull(),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referredBy: varchar("referred_by"),
  apiKey: varchar("api_key", { length: 64 }).unique(),
  apiKeyEnabled: integer("api_key_enabled").default(0), // 0 = disabled, 1 = enabled
  resellerMarkup: decimal("reseller_markup", { precision: 5, scale: 2 }).default("0.00"), // Percentage markup for resellers
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: platformEnum("platform").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  pricePerThousand: decimal("price_per_thousand", { precision: 8, scale: 2 }).notNull(),
  minQuantity: integer("min_quantity").default(100).notNull(),
  maxQuantity: integer("max_quantity").default(1000000).notNull(),
  eta: varchar("eta", { length: 100 }), // e.g., "30 min - 6 hrs"
  isActive: integer("is_active").default(1).notNull(), // 0 = disabled, 1 = enabled
  supplierServiceId: varchar("supplier_service_id"), // External API service ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable(
  "orders",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    serviceId: varchar("service_id").notNull().references(() => services.id),
    targetLink: text("target_link").notNull(),
    quantity: integer("quantity").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    supplierOrderId: varchar("supplier_order_id"), // External API order ID
    startCount: integer("start_count"),
    remainingCount: integer("remaining_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_orders_user_id").on(table.userId),
    index("idx_orders_status").on(table.status),
  ]
);

// Wallet transactions table
export const transactions = pgTable(
  "transactions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    type: transactionTypeEnum("type").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
    balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
    orderId: varchar("order_id").references(() => orders.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_transactions_user_id").on(table.userId)]
);

// Referrals table
export const referrals = pgTable(
  "referrals",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    referrerId: varchar("referrer_id").notNull().references(() => users.id),
    referredUserId: varchar("referred_user_id").notNull().references(() => users.id),
    commissionEarned: decimal("commission_earned", { precision: 10, scale: 2 }).default("0.00"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_referrals_referrer").on(table.referrerId),
    index("idx_referrals_referred").on(table.referredUserId),
  ]
);

// Payment proofs table (for UPI manual payment flow)
export const paymentProofs = pgTable(
  "payment_proofs",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    utrNumber: varchar("utr_number", { length: 50 }),
    screenshotUrl: text("screenshot_url"),
    status: paymentProofStatusEnum("status").default("pending").notNull(),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_payment_proofs_user_id").on(table.userId),
    index("idx_payment_proofs_status").on(table.status),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  transactions: many(transactions),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  paymentProofs: many(paymentProofs),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id],
    relationName: "referred",
  }),
}));

export const paymentProofsRelations = relations(paymentProofs, ({ one }) => ({
  user: one(users, {
    fields: [paymentProofs.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users);
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true, status: true, supplierOrderId: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export const insertPaymentProofSchema = createInsertSchema(paymentProofs).omit({ id: true, createdAt: true, updatedAt: true, status: true });

// TypeScript types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type PaymentProof = typeof paymentProofs.$inferSelect;
export type InsertPaymentProof = z.infer<typeof insertPaymentProofSchema>;

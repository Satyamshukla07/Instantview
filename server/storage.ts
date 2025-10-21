// Referenced from javascript_database and javascript_log_in_with_replit blueprints
import {
  users,
  services,
  orders,
  transactions,
  referrals,
  paymentProofs,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Order,
  type InsertOrder,
  type Transaction,
  type InsertTransaction,
  type Referral,
  type InsertReferral,
  type PaymentProof,
  type InsertPaymentProof,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  updateUserBalance(userId: string, newBalance: string): Promise<void>;
  generateApiKey(userId: string): Promise<string>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Order operations
  getOrders(userId: string): Promise<Order[]>;
  getRecentOrders(userId: string, limit?: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  
  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Referral operations
  getReferrals(userId: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferralCommission(id: string, commission: string): Promise<void>;
  
  // Payment proof operations
  getPaymentProofs(userId: string): Promise<PaymentProof[]>;
  getAllPaymentProofs(): Promise<PaymentProof[]>;
  getPaymentProof(id: string): Promise<PaymentProof | undefined>;
  createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof>;
  updatePaymentProofStatus(id: string, status: string, adminNotes?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Generate referral code if not exists
    if (!user.referralCode) {
      const referralCode = randomBytes(8).toString('hex').toUpperCase();
      const [updatedUser] = await db
        .update(users)
        .set({ referralCode })
        .where(eq(users.id, user.id))
        .returning();
      return updatedUser;
    }
    
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code));
    return user;
  }

  async updateUserBalance(userId: string, newBalance: string): Promise<void> {
    await db.update(users).set({ walletBalance: newBalance }).where(eq(users.id, userId));
  }

  async generateApiKey(userId: string): Promise<string> {
    const apiKey = randomBytes(32).toString('hex');
    await db.update(users).set({ apiKey, apiKeyEnabled: 1 }).where(eq(users.id, userId));
    return apiKey;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, 1));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(serviceData).returning();
    return service;
  }

  async updateService(id: string, serviceData: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ ...serviceData, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getRecentOrders(userId: string, limit: number = 10): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id));
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
    return transaction;
  }

  // Referral operations
  async getReferrals(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(referralData).returning();
    return referral;
  }

  async updateReferralCommission(id: string, commission: string): Promise<void> {
    await db.update(referrals).set({ commissionEarned: commission }).where(eq(referrals.id, id));
  }

  // Payment proof operations
  async getPaymentProofs(userId: string): Promise<PaymentProof[]> {
    return await db
      .select()
      .from(paymentProofs)
      .where(eq(paymentProofs.userId, userId))
      .orderBy(desc(paymentProofs.createdAt));
  }

  async getAllPaymentProofs(): Promise<PaymentProof[]> {
    return await db.select().from(paymentProofs).orderBy(desc(paymentProofs.createdAt));
  }

  async getPaymentProof(id: string): Promise<PaymentProof | undefined> {
    const [proof] = await db.select().from(paymentProofs).where(eq(paymentProofs.id, id));
    return proof;
  }

  async createPaymentProof(proofData: InsertPaymentProof): Promise<PaymentProof> {
    const [proof] = await db.insert(paymentProofs).values(proofData).returning();
    return proof;
  }

  async updatePaymentProofStatus(id: string, status: string, adminNotes?: string): Promise<void> {
    await db
      .update(paymentProofs)
      .set({ 
        status: status as any, 
        adminNotes,
        updatedAt: new Date() 
      })
      .where(eq(paymentProofs.id, id));
  }
}

export const storage = new DatabaseStorage();

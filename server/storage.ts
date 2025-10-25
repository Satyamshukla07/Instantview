// MongoDB Storage implementation using Mongoose
import type {
  UpsertUser,
  InsertService,
  InsertOrder,
  InsertTransaction,
  InsertReferral,
  InsertPaymentProof,
  InsertConsentLog,
} from "@shared/schema";
import type {
  User,
  Service,
  Order,
  Transaction,
  Referral,
  PaymentProof,
  ConsentLog,
} from "./models";
import {
  UserModel,
  ServiceModel,
  OrderModel,
  TransactionModel,
  ReferralModel,
  PaymentProofModel,
  ConsentLogModel,
  connectDB,
} from "./db";
import { randomBytes } from "crypto";

// Helper to generate UUID (server-side only)
const generateUUID = () => randomBytes(16).toString('hex');

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(email: string, passwordHash: string, firstName?: string, lastName?: string, referredBy?: string): Promise<User>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  updateUserBalance(userId: string, newBalance: number): Promise<void>;
  updateUserRole(userId: string, role: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
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
  updateReferralCommission(id: string, commission: number): Promise<void>;
  
  // Payment proof operations
  getPaymentProofs(userId: string): Promise<PaymentProof[]>;
  getAllPaymentProofs(): Promise<PaymentProof[]>;
  getPaymentProof(id: string): Promise<PaymentProof | undefined>;
  createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof>;
  updatePaymentProofStatus(id: string, status: string, adminNotes?: string): Promise<void>;
  
  // Consent log operations
  createConsentLog(log: InsertConsentLog): Promise<ConsentLog>;
  getConsentLogs(userId: string): Promise<ConsentLog[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Ensure DB connection on initialization
    connectDB().catch(err => console.error("Failed to connect to MongoDB:", err));
  }

  // ===== USER OPERATIONS =====
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    return user as unknown as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    return user as unknown as User | undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().sort({ createdAt: -1 }).lean();
    return users as unknown as User[];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id;
    
    // First check if user exists by ID
    let existingUser = await UserModel.findById(userId);

    if (existingUser) {
      // Update existing user (preserve role)
      existingUser.email = userData.email ?? existingUser.email;
      existingUser.firstName = userData.firstName ?? existingUser.firstName;
      existingUser.lastName = userData.lastName ?? existingUser.lastName;
      existingUser.profileImageUrl = userData.profileImageUrl ?? existingUser.profileImageUrl;
      await existingUser.save();
      return existingUser.toJSON() as unknown as User;
    }
    
    // Check if user exists with same email (for dev auto-login scenario)
    if (userData.email) {
      const userByEmail = await UserModel.findOne({ email: userData.email.toLowerCase() });
      if (userByEmail) {
        // Update the existing user's data
        userByEmail.firstName = userData.firstName ?? userByEmail.firstName;
        userByEmail.lastName = userData.lastName ?? userByEmail.lastName;
        userByEmail.profileImageUrl = userData.profileImageUrl ?? userByEmail.profileImageUrl;
        await userByEmail.save();
        return userByEmail.toJSON() as unknown as User;
      }
    }
    
    // Create new user with role='user' and generate referral code
    const referralCode = randomBytes(8).toString('hex').toUpperCase();
    const newUser = new UserModel({
      _id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: 'user',
      referralCode,
    });
    await newUser.save();
    return newUser.toJSON() as unknown as User;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ referralCode: code }).lean();
    return user as unknown as User | undefined;
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { walletBalance: newBalance });
  }

  async createLocalUser(email: string, passwordHash: string, firstName?: string, lastName?: string, referredBy?: string): Promise<User> {
    const userId = randomBytes(16).toString('hex');
    const referralCode = randomBytes(8).toString('hex').toUpperCase();
    const newUser = new UserModel({
      _id: userId,
      email: email.toLowerCase(),
      passwordHash,
      authProvider: 'local',
      firstName: firstName || null,
      lastName: lastName || null,
      role: 'user',
      referralCode,
      referredBy: referredBy || null,
    });
    await newUser.save();
    return newUser.toJSON() as unknown as User;
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { role });
  }

  async deleteUser(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
  }

  async generateApiKey(userId: string): Promise<string> {
    const apiKey = randomBytes(32).toString('hex');
    await UserModel.findByIdAndUpdate(userId, { apiKey, apiKeyEnabled: 1 });
    return apiKey;
  }

  // ===== SERVICE OPERATIONS =====
  async getServices(): Promise<Service[]> {
    const services = await ServiceModel.find().sort({ createdAt: -1 }).lean();
    return services as unknown as Service[];
  }

  async getActiveServices(): Promise<Service[]> {
    const services = await ServiceModel.find({ isActive: 1 }).lean();
    return services as unknown as Service[];
  }

  async getService(id: string): Promise<Service | undefined> {
    const service = await ServiceModel.findById(id).lean();
    return service as unknown as Service | undefined;
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const service = new ServiceModel({
      _id: generateUUID(),
      ...serviceData,
    });
    await service.save();
    return service.toJSON() as unknown as Service;
  }

  async updateService(id: string, serviceData: Partial<InsertService>): Promise<Service> {
    const service = await ServiceModel.findByIdAndUpdate(
      id,
      { ...serviceData, updatedAt: new Date() },
      { new: true }
    );
    if (!service) {
      throw new Error('Service not found');
    }
    return service.toJSON() as unknown as Service;
  }

  async deleteService(id: string): Promise<void> {
    await ServiceModel.findByIdAndDelete(id);
  }

  // ===== ORDER OPERATIONS =====
  async getOrders(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return orders as unknown as Order[];
  }

  async getRecentOrders(userId: string, limit: number = 10): Promise<Order[]> {
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return orders as unknown as Order[];
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return orders as unknown as Order[];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const order = await OrderModel.findById(id).lean();
    return order as unknown as Order | undefined;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order = new OrderModel({
      _id: generateUUID(),
      ...orderData,
      status: 'pending',
    });
    await order.save();
    return order.toJSON() as unknown as Order;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await OrderModel.findByIdAndUpdate(id, { status, updatedAt: new Date() });
  }

  // ===== TRANSACTION OPERATIONS =====
  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return transactions as unknown as Transaction[];
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const transaction = new TransactionModel({
      _id: generateUUID(),
      ...transactionData,
    });
    await transaction.save();
    return transaction.toJSON() as unknown as Transaction;
  }

  // ===== REFERRAL OPERATIONS =====
  async getReferrals(userId: string): Promise<Referral[]> {
    const referrals = await ReferralModel.find({ referrerId: userId })
      .sort({ createdAt: -1 })
      .lean();
    return referrals as unknown as Referral[];
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const referral = new ReferralModel({
      _id: generateUUID(),
      ...referralData,
    });
    await referral.save();
    return referral.toJSON() as unknown as Referral;
  }

  async updateReferralCommission(id: string, commission: number): Promise<void> {
    await ReferralModel.findByIdAndUpdate(id, { commissionEarned: commission });
  }

  // ===== PAYMENT PROOF OPERATIONS =====
  async getPaymentProofs(userId: string): Promise<PaymentProof[]> {
    const proofs = await PaymentProofModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return proofs as unknown as PaymentProof[];
  }

  async getAllPaymentProofs(): Promise<PaymentProof[]> {
    const proofs = await PaymentProofModel.find()
      .sort({ createdAt: -1 })
      .lean();
    return proofs as unknown as PaymentProof[];
  }

  async getPaymentProof(id: string): Promise<PaymentProof | undefined> {
    const proof = await PaymentProofModel.findById(id).lean();
    return proof as unknown as PaymentProof | undefined;
  }

  async createPaymentProof(proofData: InsertPaymentProof): Promise<PaymentProof> {
    const proof = new PaymentProofModel({
      _id: generateUUID(),
      ...proofData,
      status: 'pending',
    });
    await proof.save();
    return proof.toJSON() as unknown as PaymentProof;
  }

  async updatePaymentProofStatus(id: string, status: string, adminNotes?: string): Promise<void> {
    await PaymentProofModel.findByIdAndUpdate(id, {
      status,
      adminNotes,
      updatedAt: new Date(),
    });
  }

  // ===== CONSENT LOG OPERATIONS =====
  async createConsentLog(logData: InsertConsentLog): Promise<ConsentLog> {
    const log = new ConsentLogModel({
      _id: generateUUID(),
      ...logData,
    });
    await log.save();
    return log.toJSON() as unknown as ConsentLog;
  }

  async getConsentLogs(userId: string): Promise<ConsentLog[]> {
    const logs = await ConsentLogModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return logs as unknown as ConsentLog[];
  }
}

// Export storage instance
export const storage = new DatabaseStorage();

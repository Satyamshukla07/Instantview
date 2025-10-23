// In-memory storage implementation for local development
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
import { randomBytes } from "crypto";
import type { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private services = new Map<string, Service>();
  private orders = new Map<string, Order>();
  private transactions = new Map<string, Transaction>();
  private referrals = new Map<string, Referral>();
  private paymentProofs = new Map<string, PaymentProof>();
  private consentLogs = new Map<string, ConsentLog>();

  constructor() {
    // Seed with default admin user
    this.seedData();
  }

  private seedData() {
    const adminId = "admin-user-1";
    const adminUser: User = {
      _id: adminId,
      id: adminId,
      email: "admin@reelboost.com",
      passwordHash: null,
      authProvider: "local",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      role: "admin",
      walletBalance: 1000.00,
      referralCode: "ADMIN2024",
      referredBy: null,
      apiKey: null,
      apiKeyEnabled: 0,
      resellerMarkup: 0.00,
      totalEarnings: 0.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(adminId, adminUser);

    // Add some sample services
    const sampleServices: Service[] = [
      {
        _id: "service-1",
        id: "service-1",
        platform: "instagram",
        name: "Instagram Followers",
        description: "High quality Instagram followers",
        pricePerThousand: 5.00,
        minQuantity: 100,
        maxQuantity: 100000,
        eta: "1-3 hours",
        isActive: 1,
        supplierServiceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "service-2",
        id: "service-2",
        platform: "instagram",
        name: "Instagram Likes",
        description: "Real Instagram likes from active users",
        pricePerThousand: 3.00,
        minQuantity: 50,
        maxQuantity: 50000,
        eta: "30 min - 1 hour",
        isActive: 1,
        supplierServiceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "service-3",
        id: "service-3",
        platform: "youtube",
        name: "YouTube Views",
        description: "High retention YouTube views",
        pricePerThousand: 8.00,
        minQuantity: 100,
        maxQuantity: 1000000,
        eta: "2-6 hours",
        isActive: 1,
        supplierServiceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Service[];

    sampleServices.forEach(service => this.services.set(service.id, service));
  }

  private generateId(): string {
    return randomBytes(16).toString("hex");
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id || this.generateId();
    const existingUser = this.users.get(userId);
    
    const user: User = {
      _id: userId,
      id: userId,
      email: userData.email ?? null,
      passwordHash: userData.passwordHash ?? null,
      authProvider: userData.authProvider ?? "google",
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: existingUser?.role || "user",
      walletBalance: existingUser?.walletBalance || 0.00,
      referralCode: existingUser?.referralCode || randomBytes(8).toString("hex").toUpperCase(),
      referredBy: (userData.referredBy !== undefined ? userData.referredBy : existingUser?.referredBy) ?? null,
      apiKey: existingUser?.apiKey ?? null,
      apiKeyEnabled: existingUser?.apiKeyEnabled ?? 0,
      resellerMarkup: existingUser?.resellerMarkup ?? 0.00,
      totalEarnings: existingUser?.totalEarnings ?? 0.00,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    } as User;

    this.users.set(user.id, user);
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.referralCode === code);
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.walletBalance = newBalance;
      user.updatedAt = new Date();
    }
  }

  async generateApiKey(userId: string): Promise<string> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const apiKey = randomBytes(32).toString("hex");
    user.apiKey = apiKey;
    user.apiKeyEnabled = 1;
    user.updatedAt = new Date();
    return apiKey;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getActiveServices(): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(s => s.isActive === 1)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const serviceId = this.generateId();
    const service = {
      _id: serviceId,
      id: serviceId,
      platform: serviceData.platform,
      name: serviceData.name,
      description: serviceData.description ?? null,
      pricePerThousand: serviceData.pricePerThousand,
      minQuantity: serviceData.minQuantity ?? 100,
      maxQuantity: serviceData.maxQuantity ?? 1000000,
      eta: serviceData.eta ?? null,
      isActive: serviceData.isActive ?? 1,
      supplierServiceId: serviceData.supplierServiceId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Service;
    this.services.set(serviceId, service);
    return service;
  }

  async updateService(id: string, serviceData: Partial<InsertService>): Promise<Service> {
    const service = this.services.get(id);
    if (!service) throw new Error("Service not found");
    
    const updated = {
      ...service,
      ...serviceData,
      updatedAt: new Date(),
    } as Service;
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    this.services.delete(id);
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentOrders(userId: string, limit: number = 10): Promise<Order[]> {
    return this.getOrders(userId).then(orders => orders.slice(0, limit));
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const orderId = this.generateId();
    const order = {
      _id: orderId,
      id: orderId,
      ...orderData,
      status: "pending",
      supplierOrderId: null,
      startCount: null,
      remainingCount: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Order;
    this.orders.set(orderId, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status as any;
      order.updatedAt = new Date();
    }
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const transactionId = this.generateId();
    const transaction = {
      _id: transactionId,
      id: transactionId,
      ...transactionData,
      description: transactionData.description ?? null,
      orderId: transactionData.orderId ?? null,
      createdAt: new Date(),
    } as Transaction;
    this.transactions.set(transactionId, transaction);
    return transaction;
  }

  // Referral operations
  async getReferrals(userId: string): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(r => r.referrerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const referralId = this.generateId();
    const referral = {
      _id: referralId,
      id: referralId,
      ...referralData,
      commissionEarned: 0.00,
      createdAt: new Date(),
    } as Referral;
    this.referrals.set(referralId, referral);
    return referral;
  }

  async updateReferralCommission(id: string, commission: number): Promise<void> {
    const referral = this.referrals.get(id);
    if (referral) {
      referral.commissionEarned = commission;
    }
  }

  // Payment proof operations
  async getPaymentProofs(userId: string): Promise<PaymentProof[]> {
    return Array.from(this.paymentProofs.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllPaymentProofs(): Promise<PaymentProof[]> {
    return Array.from(this.paymentProofs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPaymentProof(id: string): Promise<PaymentProof | undefined> {
    return this.paymentProofs.get(id);
  }

  async createPaymentProof(proofData: InsertPaymentProof): Promise<PaymentProof> {
    const proofId = this.generateId();
    const proof = {
      _id: proofId,
      id: proofId,
      ...proofData,
      utrNumber: proofData.utrNumber || null,
      screenshotUrl: proofData.screenshotUrl || null,
      status: "pending",
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PaymentProof;
    this.paymentProofs.set(proofId, proof);
    return proof;
  }

  async updatePaymentProofStatus(id: string, status: string, adminNotes?: string): Promise<void> {
    const proof = this.paymentProofs.get(id);
    if (proof) {
      proof.status = status as any;
      proof.adminNotes = adminNotes || null;
      proof.updatedAt = new Date();
    }
  }

  // Consent log operations
  async createConsentLog(logData: InsertConsentLog): Promise<ConsentLog> {
    const logId = this.generateId();
    const log = {
      _id: logId,
      id: logId,
      userId: logData.userId ?? null,
      ipAddress: logData.ipAddress ?? null,
      consentVersion: logData.consentVersion ?? "v1.0",
      orderId: logData.orderId ?? null,
      createdAt: new Date(),
    } as ConsentLog;
    this.consentLogs.set(logId, log);
    return log;
  }

  async getConsentLogs(userId: string): Promise<ConsentLog[]> {
    return Array.from(this.consentLogs.values())
      .filter(l => l.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

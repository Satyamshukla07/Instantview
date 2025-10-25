// Referenced from javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { setupLocalPasswordAuth } from "./localPasswordAuth";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  setupLocalPasswordAuth(app);

  // Apply rate limiting to all API routes
  app.use("/api", limiter);

  // ===== AUTH ROUTES =====
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ===== SERVICE ROUTES =====
  // Get all active services (public for authenticated users)
  app.get("/api/services", isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get single service
  app.get("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // ===== ORDER ROUTES =====
  // Get user's orders
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get recent orders
  app.get("/api/orders/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const orders = await storage.getRecentOrders(userId, 10);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  // Create order
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { serviceId, targetLink, quantity, consentAgreed } = req.body;

      // Validate inputs
      if (!serviceId || !targetLink || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate consent (required by Indian IT Act and Consumer Protection Act)
      if (consentAgreed !== true) {
        return res.status(400).json({ 
          message: "You must agree to the Terms of Service, Privacy Policy, and Refund Policy to place an order" 
        });
      }

      // Get service
      const service = await storage.getService(serviceId);
      if (!service || service.isActive !== 1) {
        return res.status(404).json({ message: "Service not found or inactive" });
      }

      // Validate quantity
      if (quantity < service.minQuantity || quantity > service.maxQuantity) {
        return res.status(400).json({ 
          message: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}` 
        });
      }

      // Calculate price
      const amount = (quantity / 1000) * service.pricePerThousand;

      // Get user and check balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const walletBalance = user.walletBalance;
      if (walletBalance < amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Create order
      const order = await storage.createOrder({
        userId,
        serviceId,
        targetLink,
        quantity,
        amount,
      });

      // Deduct from wallet and create transaction
      const newBalance = walletBalance - amount;
      await storage.updateUserBalance(userId, newBalance);
      
      await storage.createTransaction({
        userId,
        type: "order",
        amount,
        balanceBefore: user.walletBalance,
        balanceAfter: newBalance,
        description: `Order #${order.id.slice(0, 8)} - ${service.name}`,
        orderId: order.id,
      });

      // Log consent (required by Indian IT Act for order processing)
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      await storage.createConsentLog({
        userId,
        ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress,
        consentVersion: "v1.0",
        orderId: order.id,
      });

      // Simulate order processing with auto-status updates for real-time demo
      setTimeout(async () => {
        try {
          await storage.updateOrderStatus(order.id, "processing");
          setTimeout(async () => {
            try {
              await storage.updateOrderStatus(order.id, "completed");
            } catch (error) {
              console.error("Error completing order:", error);
            }
          }, 5000); // Complete after 5 seconds
        } catch (error) {
          console.error("Error processing order:", error);
        }
      }, 3000); // Start processing after 3 seconds

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // ===== WALLET/TRANSACTION ROUTES =====
  // Get user transactions
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Submit UPI payment proof
  app.post("/api/wallet/submit-payment-proof", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { amount, utrNumber, screenshotUrl } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (!utrNumber && !screenshotUrl) {
        return res.status(400).json({ message: "Please provide UTR number or payment screenshot URL" });
      }

      const proof = await storage.createPaymentProof({
        userId,
        amount: parseFloat(amount),
        utrNumber,
        screenshotUrl,
      });

      res.json({ 
        success: true, 
        message: "Payment proof submitted successfully. Admin will verify and credit your wallet within 24 hours.",
        proof 
      });
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      res.status(500).json({ message: "Failed to submit payment proof" });
    }
  });

  // Get user's payment proofs
  app.get("/api/wallet/payment-proofs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const proofs = await storage.getPaymentProofs(userId);
      res.json(proofs);
    } catch (error) {
      console.error("Error fetching payment proofs:", error);
      res.status(500).json({ message: "Failed to fetch payment proofs" });
    }
  });

  // ===== REFERRAL ROUTES =====
  // Get user referrals
  app.get("/api/referrals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const referrals = await storage.getReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Get user analytics
  app.get("/api/analytics/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const [orders, transactions, allServices] = await Promise.all([
        storage.getOrders(userId),
        storage.getTransactions(userId),
        storage.getServices(),
      ]);

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
      
      // Orders by status
      const ordersByStatus = {
        pending: orders.filter(o => o.status === "pending").length,
        processing: orders.filter(o => o.status === "processing").length,
        completed: orders.filter(o => o.status === "completed").length,
        failed: orders.filter(o => o.status === "failed").length,
      };

      // Popular services (top 5)
      const serviceCount: Record<string, number> = {};
      orders.forEach(order => {
        serviceCount[order.serviceId] = (serviceCount[order.serviceId] || 0) + 1;
      });
      const popularServices = Object.entries(serviceCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([serviceId, count]) => {
          const service = allServices.find(s => s.id === serviceId);
          return {
            serviceId,
            serviceName: service?.name || "Unknown Service",
            platform: service?.platform || "unknown",
            orderCount: count,
          };
        });

      // Spending trend (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const spendingByDay: Record<string, number> = {};
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= thirtyDaysAgo) {
          const dateKey = orderDate.toISOString().split('T')[0];
          spendingByDay[dateKey] = (spendingByDay[dateKey] || 0) + order.amount;
        }
      });

      const spendingTrend = Object.entries(spendingByDay)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }));

      res.json({
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        ordersByStatus,
        popularServices,
        spendingTrend,
      });
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // ===== ADMIN ROUTES =====
  // Get all users (admin only)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create user (admin only)
  app.post("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const createUserSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: z.enum(["user", "admin", "reseller"]).optional(),
      });

      const validationResult = createUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0].message 
        });
      }

      const { email, password, firstName, lastName, role = "user" } = validationResult.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createLocalUser(
        email,
        hashedPassword,
        firstName,
        lastName
      );

      // Update role if different from default
      if (role !== "user") {
        await storage.updateUserRole(newUser.id, role);
      }

      res.json({ success: true, user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user (admin only)
  app.patch("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { role, walletBalance } = req.body;
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update role if provided
      if (role && ["user", "admin", "reseller"].includes(role)) {
        await storage.updateUserRole(id, role);
      }

      // Update wallet balance if provided
      if (typeof walletBalance === 'number') {
        await storage.updateUserBalance(id, walletBalance);
      }

      res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.deleteUser(id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Get all orders (admin only)
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update order status (admin only)
  app.patch("/api/admin/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      await storage.updateOrderStatus(id, status);
      res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Get all services (admin only)
  app.get("/api/admin/services", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Create service (admin only)
  app.post("/api/admin/services", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const serviceData = req.body;
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Update service (admin only)
  app.patch("/api/admin/services/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const service = await storage.updateService(id, serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  // Delete service (admin only)
  app.delete("/api/admin/services/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteService(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Get all payment proofs (admin only)
  app.get("/api/admin/payment-proofs", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const proofs = await storage.getAllPaymentProofs();
      res.json(proofs);
    } catch (error) {
      console.error("Error fetching payment proofs:", error);
      res.status(500).json({ message: "Failed to fetch payment proofs" });
    }
  });

  // Approve/reject payment proof (admin only)
  app.patch("/api/admin/payment-proofs/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const proof = await storage.getPaymentProof(id);
      if (!proof) {
        return res.status(404).json({ message: "Payment proof not found" });
      }

      if (proof.status !== "pending") {
        return res.status(400).json({ message: "Payment proof already processed" });
      }

      // Update payment proof status
      await storage.updatePaymentProofStatus(id, status, adminNotes);

      // If approved, credit user's wallet
      if (status === "approved") {
        const user = await storage.getUser(proof.userId);
        if (user) {
          const currentBalance = user.walletBalance;
          const amount = proof.amount;
          const newBalance = currentBalance + amount;

          await storage.updateUserBalance(proof.userId, newBalance);

          // Create transaction record
          await storage.createTransaction({
            userId: proof.userId,
            type: "deposit",
            amount: proof.amount,
            balanceBefore: user.walletBalance,
            balanceAfter: newBalance,
            description: `Wallet top-up via UPI${proof.utrNumber ? ` (UTR: ${proof.utrNumber})` : ''}`,
          });
        }
      }

      res.json({ success: true, message: `Payment proof ${status}` });
    } catch (error) {
      console.error("Error updating payment proof:", error);
      res.status(500).json({ message: "Failed to update payment proof" });
    }
  });

  // Get admin analytics (admin only)
  app.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const [allOrders, allProofs, allServices] = await Promise.all([
        storage.getAllOrders(),
        storage.getAllPaymentProofs(),
        storage.getServices(),
      ]);

      // Calculate stats
      const totalOrders = allOrders.length;
      const completedOrders = allOrders.filter(o => o.status === "completed").length;
      const pendingOrders = allOrders.filter(o => o.status === "pending").length;
      const processingOrders = allOrders.filter(o => o.status === "processing").length;
      
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.amount, 0);
      
      const pendingProofs = allProofs.filter(p => p.status === "pending").length;
      const approvedProofs = allProofs.filter(p => p.status === "approved").length;
      const rejectedProofs = allProofs.filter(p => p.status === "rejected").length;

      const activeServices = allServices.filter(s => s.isActive === 1).length;

      res.json({
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          processing: processingOrders,
        },
        revenue: {
          total: totalRevenue.toFixed(2),
        },
        paymentProofs: {
          pending: pendingProofs,
          approved: approvedProofs,
          rejected: rejectedProofs,
        },
        services: {
          total: allServices.length,
          active: activeServices,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // ===== RESELLER API ROUTES =====
  // Note: These would use API key authentication in production
  // For now, they use the same authentication as regular routes

  const httpServer = createServer(app);
  return httpServer;
}

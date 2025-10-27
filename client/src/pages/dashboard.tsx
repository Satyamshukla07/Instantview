import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  ShoppingCart,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  AlertCircle,
  BarChart3,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import type { Order } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface UserAnalytics {
  totalOrders: number;
  totalSpent: string;
  ordersByStatus: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  popularServices: Array<{
    serviceId: string;
    serviceName: string;
    platform: string;
    orderCount: number;
  }>;
  spendingTrend: Array<{
    date: string;
    amount: number;
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/recent"],
  });

  // Fetch user analytics
  const { data: analytics } = useQuery<UserAnalytics>({
    queryKey: ["/api/analytics/user"],
  });

  // Calculate stats
  const activeOrders = recentOrders?.filter(o => o.status === "pending" || o.status === "processing").length || 0;
  const completedToday = recentOrders?.filter(o => {
    const today = new Date().toDateString();
    const orderDate = new Date(o.createdAt).toDateString();
    return o.status === "completed" && orderDate === today;
  }).length || 0;
  const totalSpent = recentOrders?.reduce((sum, order) => sum + order.amount, 0) || 0;

  const stats = [
    {
      title: "Wallet Balance",
      value: `₹${(user?.walletBalance || 0).toFixed(2)}`,
      icon: Wallet,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      testId: "card-wallet-balance",
    },
    {
      title: "Active Orders",
      value: activeOrders.toString(),
      icon: Clock,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      testId: "card-active-orders",
    },
    {
      title: "Completed Today",
      value: completedToday.toString(),
      icon: CheckCircle2,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      testId: "card-completed-today",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      testId: "card-total-spent",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      processing: { variant: "default", label: "Processing" },
      completed: { variant: "outline", label: "Completed" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "secondary", label: "Refunded" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, {user?.firstName || "User"}! 👋
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:scale-105 shadow-lg hover:shadow-xl transition-all" size="lg" data-testid="button-new-order">
          <Link href="/services">
            <Plus className="h-5 w-5 mr-2" />
            New Order
          </Link>
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card data-testid={stat.testId} className="hover:shadow-xl transition-all duration-300 border-border/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                    <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-all">
            <Link href="/orders">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : !recentOrders || recentOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">No orders yet</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-md border hover-elevate"
                  data-testid={`order-item-${order.id}`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-muted-foreground truncate">{order.targetLink}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-medium">₹{order.amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{order.quantity.toLocaleString()} units</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      {analytics && analytics.totalOrders > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Services */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <CardTitle>Popular Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {analytics.popularServices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.popularServices.map((service, index) => {
                    const maxCount = analytics.popularServices[0].orderCount;
                    const percentage = (service.orderCount / maxCount) * 100;
                    return (
                      <div key={service.serviceId} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-muted-foreground">#{index + 1}</span>
                            <span className="font-medium">{service.serviceName}</span>
                            <Badge variant="outline" className="capitalize">{service.platform}</Badge>
                          </div>
                          <span className="text-muted-foreground">{service.orderCount} orders</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Order Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <span className="text-muted-foreground">
                      {analytics.ordersByStatus.completed} orders
                    </span>
                  </div>
                  <Progress 
                    value={(analytics.ordersByStatus.completed / analytics.totalOrders) * 100} 
                    className="h-2 [&>div]:bg-green-500" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Processing</span>
                    </div>
                    <span className="text-muted-foreground">
                      {analytics.ordersByStatus.processing} orders
                    </span>
                  </div>
                  <Progress 
                    value={(analytics.ordersByStatus.processing / analytics.totalOrders) * 100} 
                    className="h-2 [&>div]:bg-blue-500" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Pending</span>
                    </div>
                    <span className="text-muted-foreground">
                      {analytics.ordersByStatus.pending} orders
                    </span>
                  </div>
                  <Progress 
                    value={(analytics.ordersByStatus.pending / analytics.totalOrders) * 100} 
                    className="h-2 [&>div]:bg-yellow-500" 
                  />
                </div>

                {analytics.ordersByStatus.failed > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Failed</span>
                      </div>
                      <span className="text-muted-foreground">
                        {analytics.ordersByStatus.failed} orders
                      </span>
                    </div>
                    <Progress 
                      value={(analytics.ordersByStatus.failed / analytics.totalOrders) * 100} 
                      className="h-2 [&>div]:bg-red-500" 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {user?.referralCode && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Earn with Referrals</h3>
                <p className="text-sm text-muted-foreground">
                  Share your referral code and earn 10% commission on every purchase
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/referrals">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

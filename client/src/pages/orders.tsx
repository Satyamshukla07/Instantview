import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ShoppingCart, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const previousOrders = useRef<Map<string, string>>(new Map());

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });

  // Detect status changes and show toasts
  useEffect(() => {
    if (!orders) return;

    orders.forEach((order) => {
      const previousStatus = previousOrders.current.get(order.id);
      
      if (previousStatus && previousStatus !== order.status) {
        // Status changed, show notification
        const statusEmoji = order.status === "completed" ? "✅" : 
                          order.status === "processing" ? "⚙️" : "⏳";
        
        toast({
          title: `${statusEmoji} Order Status Updated`,
          description: `Order #${order.id.slice(0, 8)} is now ${order.status}`,
          duration: 5000,
        });
      }
      
      // Update previous status
      previousOrders.current.set(order.id, order.status);
    });
  }, [orders, toast]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { 
      variant: "default" | "secondary" | "destructive" | "outline", 
      className?: string,
      icon?: React.ReactNode
    }> = {
      pending: { 
        variant: "secondary", 
        className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 animate-pulse",
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      processing: { 
        variant: "default", 
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
        icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      },
      completed: { 
        variant: "outline", 
        className: "bg-green-500/10 text-green-700 dark:text-green-400",
        icon: <CheckCircle className="h-3 w-3 mr-1" />
      },
      failed: { variant: "destructive" },
      refunded: { variant: "secondary" },
    };
    const style = config[status] || config.pending;
    return (
      <Badge variant={style.variant} className={style.className}>
        <div className="flex items-center">
          {style.icon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </Badge>
    );
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = order.targetLink.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Order History</h1>
        <p className="text-muted-foreground mt-1">
          View and track all your orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-orders"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.targetLink}
                      </TableCell>
                      <TableCell>{order.quantity.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ₹{parseFloat(order.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Shield, TrendingUp, DollarSign, Package, AlertCircle, CheckCircle, XCircle, Eye, Plus } from "lucide-react";
import type { PaymentProof, Service, Order, User } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServiceSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { z } from "zod";

type ServiceFormData = z.infer<typeof insertServiceSchema>;

interface AnalyticsData {
  orders: {
    total: number;
    completed: number;
    pending: number;
    processing: number;
  };
  revenue: {
    total: string;
  };
  paymentProofs: {
    pending: number;
    approved: number;
    rejected: number;
  };
  services: {
    total: number;
    active: number;
  };
}

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage services, approve payments, and view analytics</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="payment-proofs" data-testid="tab-payment-proofs">Payment Proofs</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
          <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="payment-proofs">
          <PaymentProofsTab selectedProof={selectedProof} setSelectedProof={setSelectedProof} />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab 
            selectedService={selectedService} 
            setSelectedService={setSelectedService}
            isDialogOpen={isServiceDialogOpen}
            setIsDialogOpen={setIsServiceDialogOpen}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsTab() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
  });

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card data-testid="card-total-orders">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.orders.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.orders.completed} completed, {analytics.orders.pending} pending
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-total-revenue">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{analytics.revenue.total}</div>
          <p className="text-xs text-muted-foreground mt-1">From all orders</p>
        </CardContent>
      </Card>

      <Card data-testid="card-pending-proofs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Proofs</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.paymentProofs.pending}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.paymentProofs.approved} approved, {analytics.paymentProofs.rejected} rejected
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-active-services">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.services.active}</div>
          <p className="text-xs text-muted-foreground mt-1">Out of {analytics.services.total} total</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentProofsTab({ selectedProof, setSelectedProof }: { 
  selectedProof: PaymentProof | null; 
  setSelectedProof: (proof: PaymentProof | null) => void;
}) {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState("");

  const { data: proofs, isLoading } = useQuery<PaymentProof[]>({
    queryKey: ["/api/admin/payment-proofs"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/payment-proofs/${id}`, {
        status,
        adminNotes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-proofs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({
        title: "Success",
        description: "Payment proof updated successfully",
      });
      setSelectedProof(null);
      setAdminNotes("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading payment proofs...</div>;
  }

  const pendingProofs = proofs?.filter(p => p.status === "pending") || [];
  const processedProofs = proofs?.filter(p => p.status !== "pending") || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Payment Proofs</CardTitle>
          <CardDescription>Review and approve or reject payment submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingProofs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending payment proofs</p>
          ) : (
            <div className="space-y-4">
              {pendingProofs.map((proof) => (
                <Card key={proof.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pending</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(proof.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-sm">
                            <span className="font-medium">Amount:</span> ₹{proof.amount}
                          </div>
                          {proof.utrNumber && (
                            <div className="text-sm">
                              <span className="font-medium">UTR:</span> {proof.utrNumber}
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="font-medium">User ID:</span> {proof.userId.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {proof.screenshotUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(proof.screenshotUrl || "", "_blank")}
                            data-testid={`button-view-screenshot-${proof.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedProof(proof)}
                              data-testid={`button-review-${proof.id}`}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Payment Proof</DialogTitle>
                              <DialogDescription>
                                Approve or reject this payment submission
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <div className="text-sm">
                                  <span className="font-medium">Amount:</span> ₹{proof.amount}
                                </div>
                                {proof.utrNumber && (
                                  <div className="text-sm">
                                    <span className="font-medium">UTR Number:</span> {proof.utrNumber}
                                  </div>
                                )}
                                {proof.screenshotUrl && (
                                  <div className="text-sm">
                                    <span className="font-medium">Screenshot:</span>{" "}
                                    <a 
                                      href={proof.screenshotUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      View Screenshot
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label>Admin Notes (Optional)</Label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about this approval/rejection..."
                                  data-testid="textarea-admin-notes"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => approveMutation.mutate({ id: proof.id, status: "approved" })}
                                  disabled={approveMutation.isPending}
                                  className="flex-1"
                                  data-testid="button-approve"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => approveMutation.mutate({ id: proof.id, status: "rejected" })}
                                  disabled={approveMutation.isPending}
                                  className="flex-1"
                                  data-testid="button-reject"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Payment Proofs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedProofs.map((proof) => (
                <TableRow key={proof.id}>
                  <TableCell>{new Date(proof.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>₹{proof.amount}</TableCell>
                  <TableCell>{proof.utrNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={proof.status === "approved" ? "default" : "destructive"}>
                      {proof.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{proof.adminNotes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ServicesTab({ 
  selectedService, 
  setSelectedService,
  isDialogOpen,
  setIsDialogOpen
}: { 
  selectedService: Service | null; 
  setSelectedService: (service: Service | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      platform: "instagram",
      name: "",
      description: "",
      pricePerThousand: "0.00",
      minQuantity: 100,
      maxQuantity: 10000,
      eta: "",
      isActive: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      return await apiRequest("POST", "/api/admin/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: number }) => {
      return await apiRequest("PATCH", `/api/admin/services/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Service status updated",
      });
    },
  });

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Manage Services</h3>
          <p className="text-sm text-muted-foreground">Create, edit, and toggle service availability</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-service">
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>Add a new service to the platform</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Instagram Followers" data-testid="input-service-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} placeholder="High-quality followers..." data-testid="textarea-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricePerThousand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per 1000</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" data-testid="input-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="1-2 hours" data-testid="input-eta" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-min-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-max-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-service">
                  {createMutation.isPending ? "Creating..." : "Create Service"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Price/1K</TableHead>
                <TableHead>Min-Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services?.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="capitalize">{service.platform}</TableCell>
                  <TableCell>₹{service.pricePerThousand}</TableCell>
                  <TableCell>{service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive === 1 ? "default" : "secondary"}>
                      {service.isActive === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActiveMutation.mutate({ 
                        id: service.id, 
                        isActive: service.isActive === 1 ? 0 : 1 
                      })}
                      data-testid={`button-toggle-${service.id}`}
                    >
                      {service.isActive === 1 ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>View and manage platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div>
                      <div>{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === "admin" ? "default" :
                    user.role === "reseller" ? "secondary" :
                    "outline"
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">₹{user.walletBalance}</TableCell>
                <TableCell className="font-mono text-xs">{user.referralCode || "N/A"}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>View all orders across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.serviceId.slice(0, 8)}...</TableCell>
                <TableCell>{order.quantity.toLocaleString()}</TableCell>
                <TableCell>₹{order.amount}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      order.status === "completed" ? "default" :
                      order.status === "processing" ? "secondary" :
                      "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

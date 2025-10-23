import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Pencil, 
  Trash2, 
  Plus,
  DollarSign,
  Package,
  Loader2,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { z } from "zod";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  pricePerUnit: number;
  minOrder: number;
  maxOrder: number;
  isActive: boolean;
}

const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  platform: z.string().min(1, "Platform is required"),
  pricePerUnit: z.number()
    .positive("Price must be greater than 0")
    .finite("Price must be a valid number"),
  minOrder: z.number()
    .int("Min order must be a whole number")
    .positive("Min order must be greater than 0")
    .finite("Min order must be a valid number"),
  maxOrder: z.number()
    .int("Max order must be a whole number")
    .positive("Max order must be greater than 0")
    .finite("Max order must be a valid number"),
  isActive: z.boolean(),
}).refine((data) => data.maxOrder > data.minOrder, {
  message: "Max order must be greater than min order",
  path: ["maxOrder"],
});

export default function ManageServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    description: "",
    category: "followers",
    platform: "instagram",
    pricePerUnit: 0,
    minOrder: 100,
    maxOrder: 10000,
    isActive: true,
  });
  const { toast } = useToast();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: Partial<Service>) => {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsCreateMode(false);
      resetForm();
      toast({
        title: "Success",
        description: "Service created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (data: { serviceId: string; updates: Partial<Service> }) => {
      const response = await fetch(`/api/admin/services/${data.serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setSelectedService(null);
      resetForm();
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDeleteServiceId(null);
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "followers",
      platform: "instagram",
      pricePerUnit: 0,
      minOrder: 100,
      maxOrder: 10000,
      isActive: true,
    });
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateService = () => {
    setIsCreateMode(true);
    setSelectedService(null);
    resetForm();
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormData(service);
    setIsCreateMode(false);
  };

  const handleSaveService = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    const validatedData = {
      ...formData,
      pricePerUnit: Number(formData.pricePerUnit),
      minOrder: Number(formData.minOrder),
      maxOrder: Number(formData.maxOrder),
    };

    if (isCreateMode) {
      createServiceMutation.mutate(validatedData);
    } else if (selectedService) {
      updateServiceMutation.mutate({
        serviceId: selectedService._id,
        updates: validatedData,
      });
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setDeleteServiceId(serviceId);
  };

  const confirmDelete = () => {
    if (deleteServiceId) {
      deleteServiceMutation.mutate(deleteServiceId);
    }
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    try {
      serviceFormSchema.parse({
        ...formData,
        pricePerUnit: Number(formData.pricePerUnit) || 0,
        minOrder: Number(formData.minOrder) || 0,
        maxOrder: Number(formData.maxOrder) || 0,
      });
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        return { isValid: false, errors };
      }
      return { isValid: false, errors: ["Validation failed"] };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-manage-services">Manage Services</h1>
            <p className="text-muted-foreground mt-1">Create and manage platform services</p>
          </div>
          <Button onClick={handleCreateService} data-testid="button-create-service">
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Services</CardTitle>
                <CardDescription>Total services: {services.length}</CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                  data-testid="input-search-services"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Min/Max</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No services found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServices.map((service) => (
                        <TableRow key={service._id} data-testid={`row-service-${service._id}`}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {service.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{service.platform}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-semibold">
                              ₹{service.pricePerUnit.toFixed(2)}/1K
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {service.minOrder.toLocaleString()} - {service.maxOrder.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? (
                                <><Check className="h-3 w-3 mr-1" /> Active</>
                              ) : (
                                <><X className="h-3 w-3 mr-1" /> Inactive</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditService(service)}
                                data-testid={`button-edit-service-${service._id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteService(service._id)}
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-service-${service._id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Service Dialog */}
      <Dialog open={isCreateMode || !!selectedService} onOpenChange={() => {
        setIsCreateMode(false);
        setSelectedService(null);
        resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-service-form">
          <DialogHeader>
            <DialogTitle>{isCreateMode ? "Create Service" : "Edit Service"}</DialogTitle>
            <DialogDescription>
              {isCreateMode ? "Add a new service to the platform" : "Update service details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Instagram Followers - High Quality"
                data-testid="input-service-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service..."
                rows={3}
                data-testid="input-service-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger data-testid="select-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="comments">Comments</SelectItem>
                    <SelectItem value="subscribers">Subscribers</SelectItem>
                    <SelectItem value="shares">Shares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pricePerUnit">Price per 1K (₹) *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) })}
                  data-testid="input-price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minOrder">Min Order *</Label>
                <Input
                  id="minOrder"
                  type="number"
                  min="1"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: parseInt(e.target.value) })}
                  data-testid="input-min-order"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxOrder">Max Order *</Label>
                <Input
                  id="maxOrder"
                  type="number"
                  min="1"
                  value={formData.maxOrder}
                  onChange={(e) => setFormData({ ...formData, maxOrder: parseInt(e.target.value) })}
                  data-testid="input-max-order"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
                data-testid="checkbox-is-active"
              />
              <Label htmlFor="isActive">Active (visible to users)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateMode(false);
                setSelectedService(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveService}
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              data-testid="button-save-service"
            >
              {(createServiceMutation.isPending || updateServiceMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreateMode ? "Create Service" : "Update Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteServiceId} onOpenChange={() => setDeleteServiceId(null)}>
        <AlertDialogContent data-testid="dialog-delete-service">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone and will remove the service from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteServiceMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteServiceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

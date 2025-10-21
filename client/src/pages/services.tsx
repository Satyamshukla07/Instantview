import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Instagram, Youtube, Facebook, Twitter, Send, Search, SlidersHorizontal } from "lucide-react";
import type { Service } from "@shared/schema";
import { OrderForm } from "@/components/order-form";

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  telegram: Send,
  tiktok: Send,
};

const platformColors: Record<string, string> = {
  instagram: "text-pink-500",
  youtube: "text-red-500",
  facebook: "text-blue-600",
  twitter: "text-sky-500",
  telegram: "text-blue-400",
  tiktok: "text-black dark:text-white",
};

export default function Services() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const activeServices = services?.filter(s => s.isActive === 1) || [];
  
  const platforms = ["all", "instagram", "youtube", "facebook", "twitter", "telegram", "tiktok"];
  
  const filteredServices = activeServices.filter((service) => {
    // Platform filter
    const matchesPlatform = selectedPlatform === "all" || service.platform === selectedPlatform;
    
    // Search filter
    const matchesSearch = searchTerm === "" || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const price = parseFloat(service.pricePerThousand);
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && price < 2) ||
      (priceFilter === "medium" && price >= 2 && price < 5) ||
      (priceFilter === "high" && price >= 5);
    
    // Delivery filter (based on ETA)
    const matchesDelivery = 
      deliveryFilter === "all" ||
      (deliveryFilter === "instant" && service.eta?.toLowerCase().includes("instant")) ||
      (deliveryFilter === "fast" && (service.eta?.includes("min") || service.eta?.includes("1 hr") || service.eta?.includes("2 hrs"))) ||
      (deliveryFilter === "standard" && service.eta && !service.eta.toLowerCase().includes("instant"));
    
    return matchesPlatform && matchesSearch && matchesPrice && matchesDelivery;
  });

  const handleOrderClick = (service: Service) => {
    setSelectedService(service);
    setOrderDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Services</h1>
        <p className="text-muted-foreground mt-1">
          Choose from our wide range of social media services
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-services"
              />
            </div>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-price-filter">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Low (&lt; ₹2/1K)</SelectItem>
                <SelectItem value="medium">Medium (₹2-5/1K)</SelectItem>
                <SelectItem value="high">High (&gt; ₹5/1K)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-delivery-filter">
                <SelectValue placeholder="Delivery Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Speeds</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="fast">Fast (≤ 2 hrs)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || priceFilter !== "all" || deliveryFilter !== "all") && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform];
            return (
              <TabsTrigger 
                key={platform} 
                value={platform} 
                className="gap-2"
                data-testid={`tab-${platform}`}
              >
                {Icon && <Icon className={`h-4 w-4 ${platformColors[platform]}`} />}
                <span className="capitalize">{platform}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform} value={platform} className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredServices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No services available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const PlatformIcon = platformIcons[service.platform];
                  return (
                    <Card key={service.id} className="hover-elevate" data-testid={`service-card-${service.id}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {PlatformIcon && (
                              <div className={`w-12 h-12 rounded-md bg-card flex items-center justify-center ${platformColors[service.platform]}`}>
                                <PlatformIcon className="h-6 w-6" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-base font-medium">{service.name}</CardTitle>
                              <Badge variant="outline" className="mt-1 capitalize">
                                {service.platform}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price/1K</span>
                          <span className="font-semibold">₹{parseFloat(service.pricePerThousand).toFixed(2)}</span>
                        </div>
                        {service.eta && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Delivery Time</span>
                            <span className="font-medium">{service.eta}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Min/Max</span>
                          <span className="font-medium">
                            {service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}
                          </span>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleOrderClick(service)}
                          data-testid={`button-order-${service.id}`}
                        >
                          Order Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Fill in the details to place your order
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <OrderForm 
              service={selectedService} 
              onSuccess={() => setOrderDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

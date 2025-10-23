import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Service } from "@shared/schema";
import { Wallet, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const orderSchema = z.object({
  targetLink: z.string().url("Please enter a valid URL"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  consentAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service, Privacy Policy, and Refund Policy",
  }),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  service: Service;
  onSuccess: () => void;
}

export function OrderForm({ service, onSuccess }: OrderFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(service.minQuantity);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      targetLink: "",
      quantity: service.minQuantity,
      consentAgreed: false,
    },
  });

  const consentAgreed = watch("consentAgreed");

  // Calculate price whenever quantity changes
  useEffect(() => {
    const price = (quantity / 1000) * parseFloat(service.pricePerThousand);
    setCalculatedPrice(price);
    setValue("quantity", quantity);
  }, [quantity, service.pricePerThousand, setValue]);

  const orderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const response = await apiRequest("POST", "/api/orders", {
        serviceId: service.id,
        targetLink: data.targetLink,
        quantity: data.quantity,
        consentAgreed: data.consentAgreed,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    orderMutation.mutate(data);
  };

  const walletBalance = parseFloat(user?.walletBalance || "0");
  const hasInsufficientFunds = calculatedPrice > walletBalance;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Info */}
      <div className="p-4 rounded-md bg-muted/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Service</span>
          <span className="font-medium">{service.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price per 1K</span>
          <span className="font-medium">₹{parseFloat(service.pricePerThousand).toFixed(2)}</span>
        </div>
        {service.eta && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Delivery Time</span>
            <span className="font-medium">{service.eta}</span>
          </div>
        )}
      </div>

      {/* Target Link */}
      <div className="space-y-2">
        <Label htmlFor="targetLink">Target Link *</Label>
        <Input
          id="targetLink"
          type="url"
          placeholder="https://instagram.com/p/..."
          {...register("targetLink")}
          data-testid="input-target-link"
        />
        {errors.targetLink && (
          <p className="text-sm text-destructive">{errors.targetLink.message}</p>
        )}
      </div>

      {/* Quantity Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Quantity</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || service.minQuantity;
                const clamped = Math.min(Math.max(val, service.minQuantity), service.maxQuantity);
                setQuantity(clamped);
              }}
              min={service.minQuantity}
              max={service.maxQuantity}
              className="w-32"
              data-testid="input-quantity"
            />
          </div>
        </div>
        <Slider
          value={[quantity]}
          onValueChange={([value]) => setQuantity(value)}
          min={service.minQuantity}
          max={service.maxQuantity}
          step={service.minQuantity}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Min: {service.minQuantity.toLocaleString()}</span>
          <span>Max: {service.maxQuantity.toLocaleString()}</span>
        </div>
      </div>

      {/* Price Calculation */}
      <div className="p-4 rounded-md border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Calculated Price</span>
          <span className="text-2xl font-semibold" data-testid="text-calculated-price">
            ₹{calculatedPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>Wallet Balance</span>
          </div>
          <span className={`font-medium ${hasInsufficientFunds ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}>
            ₹{walletBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Insufficient Funds Alert */}
      {hasInsufficientFunds && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Insufficient wallet balance. Please add funds to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Consent Checkbox */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consentAgreed}
            onCheckedChange={(checked) => setValue("consentAgreed", checked as boolean)}
            data-testid="checkbox-consent"
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to the{" "}
              <Link href="/terms-of-service">
                <a className="text-primary hover:underline" target="_blank" data-testid="link-terms">
                  Terms of Service
                </a>
              </Link>
              ,{" "}
              <Link href="/privacy-policy">
                <a className="text-primary hover:underline" target="_blank" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </Link>
              , and{" "}
              <Link href="/refund-policy">
                <a className="text-primary hover:underline" target="_blank" data-testid="link-refund">
                  Refund Policy
                </a>
              </Link>
              .
            </Label>
            {errors.consentAgreed && (
              <p className="text-sm text-destructive mt-1">{errors.consentAgreed.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={orderMutation.isPending || hasInsufficientFunds || !consentAgreed}
          data-testid="button-submit-order"
        >
          {orderMutation.isPending ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}

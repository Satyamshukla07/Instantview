import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, QrCode, Copy, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Transaction, PaymentProof } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const presetAmounts = [500, 1000, 2000, 5000];
const UPI_ID = "reelboost@upi";

export default function Wallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: paymentProofs } = useQuery<PaymentProof[]>({
    queryKey: ["/api/wallet/payment-proofs"],
  });

  const submitPaymentMutation = useMutation({
    mutationFn: async (data: { amount: number; utrNumber: string; screenshotUrl: string }) => {
      await apiRequest("POST", "/api/wallet/submit-payment-proof", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/payment-proofs"] });
      toast({
        title: "Payment Proof Submitted",
        description: "Your payment will be verified within 24 hours.",
      });
      setAddFundsOpen(false);
      setCustomAmount("");
      setSelectedAmount(null);
      setUtrNumber("");
      setScreenshotUrl("");
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
        title: "Error",
        description: error.message || "Failed to submit payment proof",
        variant: "destructive",
      });
    },
  });

  const handleSubmitPayment = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!utrNumber && !screenshotUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide UTR number or payment screenshot URL",
        variant: "destructive",
      });
      return;
    }

    submitPaymentMutation.mutate({ amount, utrNumber, screenshotUrl });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === "deposit" || type === "refund" || type === "referral_commission" 
      ? <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-500" />
      : <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-500" />;
  };

  const getTransactionBadge = (type: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      deposit: { variant: "outline", label: "Deposit" },
      order: { variant: "secondary", label: "Order" },
      refund: { variant: "outline", label: "Refund" },
      referral_commission: { variant: "outline", label: "Referral" },
    };
    const style = config[type] || config.deposit;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getProofStatusBadge = (status: string) => {
    const config: Record<string, { icon: any, variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { icon: Clock, variant: "secondary", label: "Pending" },
      approved: { icon: CheckCircle2, variant: "outline", label: "Approved" },
      rejected: { icon: XCircle, variant: "destructive", label: "Rejected" },
    };
    const style = config[status] || config.pending;
    const Icon = style.icon;
    return (
      <Badge variant={style.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {style.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Manage your wallet and transactions
          </p>
        </div>
        <Button onClick={() => setAddFundsOpen(true)} data-testid="button-add-funds">
          <Plus className="h-4 w-4 mr-2" />
          Add Funds via UPI
        </Button>
      </div>

      {/* Wallet Balance Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-semibold" data-testid="text-wallet-balance-main">
                ₹{parseFloat(user?.walletBalance || "0").toFixed(2)}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payment Proofs */}
      {paymentProofs && paymentProofs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentProofs.map((proof) => (
                <div key={proof.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`proof-${proof.id}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">₹{parseFloat(proof.amount).toFixed(2)}</span>
                      {getProofStatusBadge(proof.status)}
                    </div>
                    {proof.utrNumber && (
                      <p className="text-sm text-muted-foreground">UTR: {proof.utrNumber}</p>
                    )}
                    {proof.adminNotes && proof.status === "rejected" && (
                      <p className="text-sm text-destructive">Admin: {proof.adminNotes}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(proof.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          {getTransactionBadge(transaction.type)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || "—"}
                      </TableCell>
                      <TableCell className={`font-medium ${
                        transaction.type === "deposit" || transaction.type === "refund" || transaction.type === "referral_commission"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500"
                      }`}>
                        {transaction.type === "order" ? "-" : "+"}₹{parseFloat(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>₹{parseFloat(transaction.balanceAfter).toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UPI Payment Dialog */}
      <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Funds via UPI</DialogTitle>
            <DialogDescription>
              Pay via UPI and submit payment proof for verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <Label>Select Amount</Label>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    data-testid={`button-preset-${amount}`}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                min="1"
                data-testid="input-custom-amount"
              />
            </div>

            {/* UPI Payment Info */}
            {(selectedAmount || customAmount) && (
              <>
                <Alert className="bg-primary/5 border-primary/20">
                  <QrCode className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <div className="space-y-3 mt-2">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">Amount to Pay:</p>
                        <p className="text-2xl font-bold text-primary">
                          ₹{(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">UPI ID:</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-background px-3 py-2 rounded border flex-1 text-sm">
                            {UPI_ID}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(UPI_ID)}
                            data-testid="button-copy-upi"
                          >
                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>• Open any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                        <p>• Send ₹{(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)} to {UPI_ID}</p>
                        <p>• Note down the UTR/Transaction ID</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Payment Proof Form */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Submit Payment Proof</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="utrNumber">UTR / Transaction ID</Label>
                    <Input
                      id="utrNumber"
                      placeholder="Enter 12-digit UTR number"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      data-testid="input-utr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshotUrl">Payment Screenshot URL (Optional)</Label>
                    <Textarea
                      id="screenshotUrl"
                      placeholder="Upload screenshot to imgur.com and paste link here"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      rows={2}
                      data-testid="input-screenshot-url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload your payment screenshot to any image hosting service (like imgur.com) and paste the link here
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setAddFundsOpen(false);
                  setCustomAmount("");
                  setSelectedAmount(null);
                  setUtrNumber("");
                  setScreenshotUrl("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPayment}
                disabled={submitPaymentMutation.isPending || (!selectedAmount && !customAmount)}
                className="flex-1"
                data-testid="button-submit-payment"
              >
                {submitPaymentMutation.isPending ? "Submitting..." : "Submit Payment Proof"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

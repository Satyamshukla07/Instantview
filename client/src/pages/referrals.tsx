import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Check, Gift, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Referral } from "@shared/schema";

export default function Referrals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: referrals, isLoading } = useQuery<Referral[]>({
    queryKey: ["/api/referrals"],
  });

  const referralLink = user?.referralCode 
    ? `${window.location.origin}?ref=${user.referralCode}`
    : "";

  const totalEarnings = referrals?.reduce((sum, ref) => sum + parseFloat(ref.commissionEarned), 0) || 0;
  const totalReferrals = referrals?.length || 0;

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = [
    {
      title: "Total Referrals",
      value: totalReferrals.toString(),
      icon: Users,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Commission Rate",
      value: "10%",
      icon: Gift,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Referral Program</h1>
        <p className="text-muted-foreground mt-1">
          Earn 10% commission on every purchase made by your referrals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link with friends and earn commission on their purchases
          </p>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
              data-testid="input-referral-link"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex-shrink-0"
              data-testid="button-copy-referral"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          {user?.referralCode && (
            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Referral Code</span>
                <Badge variant="outline" className="font-mono">
                  {user.referralCode}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium">Share Your Link</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Copy and share your unique referral link with friends and followers
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium">They Sign Up & Order</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When someone signs up using your link and places an order
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Earn Commission</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You earn 10% commission on every purchase they make
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : !referrals || referrals.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-3">No referrals yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start sharing your link to earn commissions
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referred User</TableHead>
                    <TableHead>Commission Earned</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id} data-testid={`row-referral-${referral.id}`}>
                      <TableCell className="font-medium">
                        User #{referral.referredUserId.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-500 font-medium">
                        ₹{parseFloat(referral.commissionEarned).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(referral.createdAt).toLocaleDateString()}
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

// Referenced from Shadcn sidebar documentation in universal_design_guidelines
import {
  LayoutDashboard,
  ShoppingCart,
  History,
  Wallet,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Gift,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const userMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Services", url: "/services", icon: ShoppingCart },
    { title: "Orders", url: "/orders", icon: History },
    { title: "Wallet", url: "/wallet", icon: Wallet },
    { title: "Referrals", url: "/referrals", icon: Gift },
  ];

  const adminMenuItems = [
    { title: "Admin Panel", url: "/admin", icon: TrendingUp },
    { title: "Manage Users", url: "/admin/manage-users", icon: Users },
    { title: "Manage Services", url: "/admin/manage-services", icon: Settings },
  ];

  const resellerMenuItems = [
    { title: "API Docs", url: "/api-docs", icon: FileText },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ReelBoost</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Wallet Balance Widget */}
        {user && (
          <div className="px-6 pb-6">
            <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border-primary/20 shadow-lg">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Wallet Balance</div>
                <div className="text-3xl font-bold" data-testid="text-wallet-balance">
                  ₹{Number(user.walletBalance || 0).toFixed(2)}
                </div>
                <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all shadow-md" data-testid="button-add-funds-sidebar">
                  <Link href="/wallet">Add Funds</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reseller Menu */}
        {user?.role === "reseller" || user?.role === "admin" ? (
          <SidebarGroup>
            <SidebarGroupLabel>Reseller</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {resellerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {/* Admin Menu */}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-6">
        {user && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback>
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate" data-testid="text-user-name">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.email}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              asChild
              data-testid="button-logout"
            >
              <a href="/api/logout" title="Logout">
                <LogOut className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

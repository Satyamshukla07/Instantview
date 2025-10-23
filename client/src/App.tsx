// Referenced from javascript_log_in_with_replit blueprint and Shadcn sidebar documentation
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Services from "@/pages/services";
import Orders from "@/pages/orders";
import Wallet from "@/pages/wallet";
import Referrals from "@/pages/referrals";
import Admin from "@/pages/admin";
import ApiDocs from "@/pages/api-docs";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import RefundPolicy from "@/pages/refund-policy";
import Disclaimer from "@/pages/disclaimer";
import TermsOfService from "@/pages/terms-of-service";
import ContactUs from "@/pages/contact-us";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/contact-us" component={ContactUs} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/services" component={Services} />
          <Route path="/orders" component={Orders} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/admin" component={Admin} />
          <Route path="/api-docs" component={ApiDocs} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/contact-us" component={ContactUs} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Custom sidebar width
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isLoading || !isAuthenticated) {
    return (
      <>
        <Router />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-7xl">
              <Router />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">ReelBoost</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In Button */}
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-12 text-base"
              asChild
            >
              <a href="/api/login" className="flex items-center justify-center gap-3">
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </a>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>

            {/* Info Text */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
            <p className="text-muted-foreground">We're here to help! Reach out to us for any questions or support.</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Email Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    For general inquiries and support:
                  </p>
                  <p className="font-medium">support@reelboost.com</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    For refund requests:
                  </p>
                  <p className="font-medium">refunds@reelboost.com</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    For privacy concerns:
                  </p>
                  <p className="font-medium">privacy@reelboost.com</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    For legal matters:
                  </p>
                  <p className="font-medium">legal@reelboost.com</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Response Times</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">General Support</p>
                    <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                  </div>
                  <div>
                    <p className="font-medium">Refund Requests</p>
                    <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                  </div>
                  <div>
                    <p className="font-medium">Privacy Concerns</p>
                    <p className="text-sm text-muted-foreground">Within 7 business days</p>
                  </div>
                  <div>
                    <p className="font-medium">Urgent Issues</p>
                    <p className="text-sm text-muted-foreground">Priority handling within 12-24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Support Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our support team is available to assist you during the following hours:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 7:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Saturday</span>
                    <span className="text-muted-foreground">10:00 AM - 5:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-muted-foreground">Closed (Email support available)</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Note: Email support is monitored 24/7, but responses are provided during business hours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Before You Contact Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To help us serve you better, please provide:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Your registered email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Order ID (if inquiry is related to an order)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Detailed description of your issue or question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Any relevant screenshots or documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Transaction reference numbers (for payment-related queries)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
              <p className="text-sm text-muted-foreground">
                Before reaching out, you might find answers to common questions in our FAQ section:
              </p>
              <div className="grid gap-2 text-sm">
                <Link href="/privacy-policy">
                  <Button variant="link" className="p-0 h-auto justify-start" data-testid="link-privacy-policy">
                    Privacy Policy →
                  </Button>
                </Link>
                <Link href="/refund-policy">
                  <Button variant="link" className="p-0 h-auto justify-start" data-testid="link-refund-policy">
                    Refund & Refill Policy →
                  </Button>
                </Link>
                <Link href="/terms-of-service">
                  <Button variant="link" className="p-0 h-auto justify-start" data-testid="link-terms-of-service">
                    Terms of Service →
                  </Button>
                </Link>
                <Link href="/disclaimer">
                  <Button variant="link" className="p-0 h-auto justify-start" data-testid="link-disclaimer">
                    Disclaimer →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3">Grievance Officer</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In compliance with the Information Technology Act, 2000, and rules made thereunder, the contact
                details of the Grievance Officer are provided below:
              </p>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="text-sm"><strong>Email:</strong> privacy@reelboost.com</p>
                <p className="text-sm"><strong>Response Time:</strong> Within 7 business days</p>
                <p className="text-sm text-muted-foreground mt-3">
                  The Grievance Officer shall address complaints related to data privacy, security,
                  and other concerns as per applicable Indian laws.
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-6">
              <p>We value your feedback and are committed to providing excellent customer service.</p>
              <p className="mt-2">Your satisfaction is our priority!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
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
            <CardTitle className="text-3xl">Refund & Refill Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: October 2025 | Version 1.0</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Overview</h2>
            <p>
              This Refund & Refill Policy outlines the terms and conditions for refunds and service refills at ReelBoost.
              We are committed to providing quality digital marketing services and ensuring customer satisfaction.
            </p>

            <h2>2. Service Guarantees</h2>
            <h3>2.1 Delivery Guarantee</h3>
            <p>
              We guarantee delivery of ordered services within the specified timeframe. If delivery is not completed
              within the stated period, you may be eligible for a refund or refill.
            </p>

            <h3>2.2 Quality Guarantee</h3>
            <p>
              All services are delivered using high-quality methods. We do not guarantee retention rates as they
              depend on platform algorithms and content quality, which are beyond our control.
            </p>

            <h2>3. Refund Eligibility</h2>
            <p>You may be eligible for a refund in the following cases:</p>
            <ul>
              <li>Service not delivered within the specified timeframe</li>
              <li>Incorrect service delivered (different from what was ordered)</li>
              <li>Technical error resulting in duplicate charges</li>
              <li>Service canceled before processing begins</li>
            </ul>

            <h2>4. Non-Refundable Cases</h2>
            <p>Refunds will NOT be issued in the following situations:</p>
            <ul>
              <li>Order processing has already started</li>
              <li>Drop in engagement due to platform algorithm changes</li>
              <li>Account suspension or deletion by the platform</li>
              <li>Incorrect link provided by the customer</li>
              <li>Private or deleted content</li>
              <li>Change of mind after order placement</li>
              <li>Natural engagement fluctuations</li>
            </ul>

            <h2>5. Refill Policy</h2>
            <h3>5.1 Refill Eligibility</h3>
            <p>
              If service delivery drops below the ordered quantity within the refill period, you may request a refill.
              Refill periods vary by service and are specified at the time of purchase.
            </p>

            <h3>5.2 Refill Period</h3>
            <p>Standard refill periods:</p>
            <ul>
              <li>Followers: 30 days from delivery completion</li>
              <li>Likes: 30 days from delivery completion</li>
              <li>Views: No refill (instant service)</li>
              <li>Subscribers: 30 days from delivery completion</li>
            </ul>

            <h3>5.3 Refill Process</h3>
            <p>To request a refill:</p>
            <ol>
              <li>Log in to your account</li>
              <li>Navigate to Order History</li>
              <li>Select the order requiring refill</li>
              <li>Click "Request Refill" (if within eligible period)</li>
              <li>Provide details about the drop</li>
            </ol>

            <h2>6. Wallet Refund Process</h2>
            <p>
              Approved refunds are credited to your ReelBoost wallet within 24-48 hours. Wallet funds can be used
              for future purchases. Cash refunds to payment methods are not available.
            </p>

            <h2>7. Requesting a Refund</h2>
            <p>To request a refund:</p>
            <ol>
              <li>Contact our support team within 7 days of order placement</li>
              <li>Provide order ID and detailed reason for refund</li>
              <li>Allow 3-5 business days for review</li>
              <li>Receive confirmation via email</li>
            </ol>

            <h2>8. Partial Refunds</h2>
            <p>
              In cases where partial service delivery has occurred, we may issue a partial refund proportional
              to the undelivered portion.
            </p>

            <h2>9. UPI Payment Refunds</h2>
            <p>
              For wallet top-ups via UPI that are rejected or canceled before approval, the amount will not be
              charged. Once approved and added to your wallet, refunds follow the standard wallet refund policy.
            </p>

            <h2>10. Force Majeure</h2>
            <p>
              We are not liable for refunds in cases of service interruption due to platform policy changes,
              API restrictions, or circumstances beyond our reasonable control.
            </p>

            <h2>11. Dispute Resolution</h2>
            <p>
              In case of disputes, please contact our customer support team. We aim to resolve all issues amicably.
              Unresolved disputes will be handled in accordance with Indian consumer protection laws.
            </p>

            <h2>12. Consumer Rights</h2>
            <p>
              This policy does not limit your rights under the Consumer Protection Act, 2019. You may approach
              appropriate consumer forums for grievance redressal.
            </p>

            <h2>13. Policy Updates</h2>
            <p>
              We reserve the right to update this policy. Changes will be communicated through our website.
              Continued use of services indicates acceptance of updated terms.
            </p>

            <h2>14. Contact for Refunds</h2>
            <p>
              For refund requests or questions:<br />
              <strong>Email:</strong> refunds@reelboost.com<br />
              <strong>Response Time:</strong> Within 24-48 hours
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              This policy complies with the Consumer Protection (E-Commerce) Rules, 2020, and applicable Indian laws.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

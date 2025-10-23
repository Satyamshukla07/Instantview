import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: October 2025 | Version 1.0</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using ReelBoost services, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
              from using our services.
            </p>

            <h2>2. Service Description</h2>
            <p>
              ReelBoost provides digital marketing and social exposure services to enhance online presence. We are
              an independent service provider and not affiliated with any social media platform. Services include
              but are not limited to:
            </p>
            <ul>
              <li>Social media engagement services</li>
              <li>Content exposure and visibility enhancement</li>
              <li>Audience growth solutions</li>
              <li>Marketing analytics and insights</li>
            </ul>

            <h2>3. User Eligibility</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>4. Account Registration and Security</h2>
            <h3>4.1 Account Creation</h3>
            <p>
              You must create an account to use our services. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities under your account.
            </p>

            <h3>4.2 Account Responsibilities</h3>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Update information promptly when changes occur</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Do not share your account with others</li>
              <li>Use strong, unique passwords</li>
            </ul>

            <h2>5. Payment and Wallet</h2>
            <h3>5.1 Pricing</h3>
            <p>
              All prices are listed in Indian Rupees (₹) and are subject to change without notice. Current pricing
              is displayed on the website and is inclusive of applicable taxes.
            </p>

            <h3>5.2 Wallet System</h3>
            <p>
              Services are purchased using a prepaid wallet system. To place orders, you must first add funds to
              your wallet via approved payment methods (currently UPI).
            </p>

            <h3>5.3 Payment Processing</h3>
            <ul>
              <li>Wallet top-ups require admin approval</li>
              <li>Submit valid UPI transaction reference numbers</li>
              <li>Provide clear payment screenshots when requested</li>
              <li>Allow 24-48 hours for payment verification</li>
            </ul>

            <h3>5.4 Non-Refundable Payments</h3>
            <p>
              Wallet balances are non-refundable to original payment methods. Approved refunds are credited to
              your wallet for future use. See our Refund Policy for detailed terms.
            </p>

            <h2>6. Service Usage Terms</h2>
            <h3>6.1 Acceptable Use</h3>
            <p>You agree to use our services only for lawful purposes and in accordance with these terms. You must not:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Use services for fraudulent purposes</li>
              <li>Harass, abuse, or harm others</li>
              <li>Manipulate or exploit our services</li>
            </ul>

            <h3>6.2 Platform Compliance</h3>
            <p>
              You are solely responsible for ensuring your use of our services complies with the terms of service
              of relevant social media platforms. We are not liable for any violations or consequences.
            </p>

            <h2>7. Order Processing</h2>
            <h3>7.1 Order Placement</h3>
            <p>
              When placing an order, you must provide accurate information including the correct content URL.
              Orders cannot be modified or canceled once processing begins.
            </p>

            <h3>7.2 Delivery Timeframes</h3>
            <p>
              Estimated delivery times are provided for each service but are not guaranteed. Actual delivery may
              vary based on platform conditions, service demand, and other factors.
            </p>

            <h3>7.3 Order Cancellation</h3>
            <p>
              Orders can only be canceled before processing starts. Once processing begins, cancellation is not
              possible, and refunds will not be issued except as outlined in our Refund Policy.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content, features, and functionality on ReelBoost are owned by us or our licensors and are
              protected by copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul>
              <li>Copy, modify, or distribute our content</li>
              <li>Use our trademarks without permission</li>
              <li>Reverse engineer our software</li>
              <li>Create derivative works</li>
            </ul>

            <h2>9. Privacy and Data Protection</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy, which is incorporated into these
              terms by reference. We process personal data in accordance with the Information Technology Act, 2000,
              and applicable privacy laws.
            </p>

            <h2>10. Referral Program</h2>
            <p>
              Our referral program allows users to earn commissions by referring new customers. Terms include:
            </p>
            <ul>
              <li>Each user receives a unique referral code</li>
              <li>Commissions are earned on referred user purchases</li>
              <li>Fraud or abuse may result in account termination</li>
              <li>Commission rates are subject to change</li>
            </ul>

            <h2>11. Disclaimers and Limitations</h2>
            <h3>11.1 Service Availability</h3>
            <p>
              Services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted,
              timely, secure, or error-free service.
            </p>

            <h3>11.2 No Guaranteed Results</h3>
            <p>
              We do not guarantee specific results, engagement rates, or outcomes. Results depend on various factors
              beyond our control including content quality and platform algorithms.
            </p>

            <h3>11.3 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ReelBoost shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of our services.
            </p>

            <h2>12. Account Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul>
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent activity or abuse</li>
              <li>Non-payment of fees</li>
              <li>Legal or regulatory requirements</li>
              <li>Extended period of inactivity</li>
            </ul>

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ReelBoost, its officers, directors, employees, and agents
              from any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
            </p>
            <ul>
              <li>Your use of our services</li>
              <li>Violation of these terms</li>
              <li>Violation of any third-party rights</li>
              <li>Your violation of applicable laws</li>
            </ul>

            <h2>14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon
              posting on our website. Your continued use of services after changes constitutes acceptance of
              modified terms.
            </p>

            <h2>15. Governing Law and Jurisdiction</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts
              in India.
            </p>

            <h2>16. Dispute Resolution</h2>
            <p>
              In the event of any dispute, you agree to first attempt to resolve the matter informally by
              contacting our support team. If informal resolution fails, disputes shall be resolved through
              arbitration in accordance with Indian arbitration laws.
            </p>

            <h2>17. Consumer Rights</h2>
            <p>
              These terms do not limit your statutory rights under the Consumer Protection Act, 2019, or other
              applicable Indian consumer protection laws. You may approach appropriate consumer forums for
              grievance redressal.
            </p>

            <h2>18. Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable or invalid, that provision shall be
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain
              in full force and effect.
            </p>

            <h2>19. Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy and Refund Policy, constitute the entire
              agreement between you and ReelBoost regarding the use of our services.
            </p>

            <h2>20. Contact Information</h2>
            <p>
              For questions about these Terms of Service:<br />
              <strong>Email:</strong> legal@reelboost.com<br />
              <strong>Support:</strong> support@reelboost.com
            </p>

            <p className="text-sm text-muted-foreground mt-8 border-t pt-4">
              By using ReelBoost services, you acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service. This agreement is compliant with applicable Indian laws and regulations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

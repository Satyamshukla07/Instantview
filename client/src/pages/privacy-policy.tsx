import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: October 2025 | Version 1.0</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy describes how ReelBoost ("we", "us", or "our") collects, uses, and protects your personal information
              in accordance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices
              and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect the following personal information:</p>
            <ul>
              <li>Name and email address (for account creation)</li>
              <li>Payment information (UPI transaction details)</li>
              <li>IP address and device information</li>
              <li>Service usage and order history</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>We automatically collect:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Access times and dates</li>
              <li>Referring website addresses</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information for:</p>
            <ul>
              <li>Processing and delivering your orders</li>
              <li>Managing your account and wallet balance</li>
              <li>Providing customer support</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
              <li>Improving our services</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement reasonable security practices and procedures as per Rule 8 of SPDI Rules, 2011. This includes:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure payment processing</li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Third parties with your explicit consent</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide services and comply with legal obligations.
              Transaction records are maintained for 7 years as per Indian tax laws.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with appropriate authorities</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance user experience, maintain sessions, and analyze usage patterns.
              You can control cookie preferences through your browser settings.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for their privacy practices.
              Please review their privacy policies before sharing personal information.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from minors.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              Your data is primarily stored and processed in India. Any international transfers comply with applicable data protection laws.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date.
              Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>

            <h2>13. Grievance Officer</h2>
            <p>
              For privacy concerns or data protection queries, please contact our Grievance Officer:
            </p>
            <p>
              <strong>Email:</strong> privacy@reelboost.com<br />
              <strong>Response Time:</strong> Within 7 business days
            </p>

            <h2>14. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, contact us at:<br />
              <strong>Email:</strong> support@reelboost.com
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              This Privacy Policy is compliant with the Information Technology Act, 2000, and the SPDI Rules, 2011.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

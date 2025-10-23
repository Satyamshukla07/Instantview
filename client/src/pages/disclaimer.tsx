import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Disclaimer() {
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
            <CardTitle className="text-3xl">Disclaimer</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: October 2025 | Version 1.0</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. General Disclaimer</h2>
            <p>
              The information and services provided by ReelBoost are offered on an "as is" and "as available" basis.
              We make no representations or warranties of any kind, express or implied, about the completeness,
              accuracy, reliability, suitability, or availability of our services.
            </p>

            <h2>2. Third-Party Platform Disclaimer</h2>
            <p>
              <strong>ReelBoost is an independent digital marketing service provider and is not affiliated with,
              endorsed by, or connected to any social media platforms including but not limited to Instagram™,
              Meta™, YouTube™, Facebook™, Twitter™, TikTok™, or Telegram™.</strong>
            </p>
            <p>
              All trademarks, service marks, trade names, and logos referenced belong to their respective owners.
              We do not claim any association or endorsement from these platforms.
            </p>

            <h2>3. Service Limitations</h2>
            <h3>3.1 No Guarantee of Results</h3>
            <p>
              While we strive to deliver quality services, we do not guarantee specific outcomes, engagement rates,
              or business results. Success depends on various factors including content quality, platform algorithms,
              and market conditions beyond our control.
            </p>

            <h3>3.2 Platform Compliance</h3>
            <p>
              Users are responsible for ensuring their use of our services complies with the terms of service of
              respective social media platforms. We are not liable for any account restrictions, suspensions, or
              penalties imposed by third-party platforms.
            </p>

            <h2>4. Service Interruption</h2>
            <p>
              We do not guarantee uninterrupted or error-free service. Services may be temporarily suspended for
              maintenance, updates, or due to circumstances beyond our control including:
            </p>
            <ul>
              <li>Platform API changes or restrictions</li>
              <li>Technical failures or server outages</li>
              <li>Force majeure events</li>
              <li>Regulatory or legal requirements</li>
            </ul>

            <h2>5. User Responsibility</h2>
            <p>By using our services, you acknowledge and agree that:</p>
            <ul>
              <li>You are solely responsible for your account security</li>
              <li>You will provide accurate and complete information</li>
              <li>You will use services in compliance with applicable laws</li>
              <li>You will not engage in fraudulent or abusive behavior</li>
              <li>You understand the risks associated with social media marketing</li>
            </ul>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ReelBoost shall not be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Use or inability to use our services</li>
              <li>Unauthorized access to your account</li>
              <li>Platform policy violations or account suspensions</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Service delays, interruptions, or errors</li>
            </ul>

            <h2>7. No Professional Advice</h2>
            <p>
              Content and recommendations provided on our platform are for general informational purposes only
              and do not constitute professional marketing, legal, or financial advice. Users should conduct
              their own research and consult professionals before making decisions.
            </p>

            <h2>8. Accuracy of Information</h2>
            <p>
              While we make reasonable efforts to ensure accuracy, we do not warrant that information on our
              website is complete, accurate, or current. Service descriptions, pricing, and features are subject
              to change without notice.
            </p>

            <h2>9. External Links Disclaimer</h2>
            <p>
              Our website may contain links to third-party websites. We have no control over and assume no
              responsibility for the content, privacy policies, or practices of these sites. Visiting linked
              sites is at your own risk.
            </p>

            <h2>10. Testimonials and Results</h2>
            <p>
              Any testimonials or case studies displayed represent individual experiences and do not guarantee
              similar results for all users. Results vary based on numerous factors unique to each user.
            </p>

            <h2>11. Pricing and Payment Disclaimer</h2>
            <p>
              All prices are in Indian Rupees (₹) and are subject to change without prior notice. We reserve
              the right to modify service pricing, packages, or payment terms at any time.
            </p>

            <h2>12. Intellectual Property</h2>
            <p>
              All content on ReelBoost, including text, graphics, logos, and software, is our property or
              licensed to us and is protected by intellectual property laws. Unauthorized use is prohibited.
            </p>

            <h2>13. Regulatory Compliance</h2>
            <p>
              We provide independent digital marketing and social exposure services. Our business is operated
              in compliance with Indian laws including:
            </p>
            <ul>
              <li>Information Technology Act, 2000</li>
              <li>Consumer Protection Act, 2019</li>
              <li>GST regulations</li>
              <li>Digital marketing best practices</li>
            </ul>

            <h2>14. Age Restriction</h2>
            <p>
              Our services are intended for users 18 years of age or older. By using our services, you confirm
              that you meet this age requirement.
            </p>

            <h2>15. Modifications to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be effective immediately
              upon posting. Your continued use of services after changes constitutes acceptance.
            </p>

            <h2>16. Governing Law</h2>
            <p>
              This disclaimer shall be governed by and construed in accordance with the laws of India. Any
              disputes shall be subject to the exclusive jurisdiction of courts in India.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              For questions about this disclaimer:<br />
              <strong>Email:</strong> legal@reelboost.com
            </p>

            <p className="text-sm text-muted-foreground mt-8 border-t pt-4">
              <strong>Important Notice:</strong> We are an independent service provider offering digital marketing
              and social exposure services. We are not affiliated with any social media platform. All platform names
              and logos are trademarks of their respective owners.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

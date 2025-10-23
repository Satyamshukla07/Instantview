import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ReelBoost</h3>
            <p className="text-sm text-muted-foreground">
              Independent digital marketing and social exposure services provider.
            </p>
            <p className="text-xs text-muted-foreground">
              MSME Registered | Digital Marketing Services
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/privacy-policy" 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                data-testid="link-footer-privacy"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/refund-policy" 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                data-testid="link-footer-refund"
              >
                Refund & Refill Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                data-testid="link-footer-terms"
              >
                Terms of Service
              </Link>
              <Link 
                href="/disclaimer" 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                data-testid="link-footer-disclaimer"
              >
                Disclaimer
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/contact-us" 
                className="text-muted-foreground hover:text-foreground transition-colors" 
                data-testid="link-footer-contact"
              >
                Contact Us
              </Link>
              <a href="mailto:support@reelboost.com" className="text-muted-foreground hover:text-foreground transition-colors">
                Email Support
              </a>
              <a href="mailto:refunds@reelboost.com" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Requests
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Business Hours</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Mon-Fri: 9 AM - 7 PM IST</p>
              <p>Saturday: 10 AM - 5 PM IST</p>
              <p>Sunday: Email Support Only</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              <strong>Disclaimer:</strong> We are an independent service provider offering digital marketing and social 
              exposure services. We are not affiliated with, endorsed by, or connected to any social media platforms.
              All platform names and trademarks are property of their respective owners.
            </p>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© {currentYear} ReelBoost. All rights reserved.</p>
              <p className="text-xs">
                Compliant with IT Act 2000, Consumer Protection Act 2019 & SPDI Rules 2011
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

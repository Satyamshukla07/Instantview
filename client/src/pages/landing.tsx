import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Send,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Lock,
  Award,
  ChevronDown
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const platforms = [
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Youtube, name: "YouTube", color: "text-red-500" },
    { icon: Facebook, name: "Facebook", color: "text-blue-600" },
    { icon: Twitter, name: "Twitter", color: "text-sky-500" },
    { icon: Send, name: "Telegram", color: "text-blue-400" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Orders start processing within minutes of placement",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade encryption for all transactions",
    },
    {
      icon: DollarSign,
      title: "Best Prices",
      description: "Competitive pricing starting from ₹0.22 per 1K",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: TrendingUp, value: "1M+", label: "Orders Completed" },
    { icon: Award, value: "99.9%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Content Creator",
      image: "PS",
      content: "ReelBoost helped me grow from 5K to 50K followers in just 3 months! The engagement is 100% real and organic.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Digital Marketer",
      image: "RV",
      content: "Best SMM panel I've used. Fast delivery, great prices, and excellent customer support. Highly recommended!",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Influencer",
      image: "AD",
      content: "This reel got 10K views in 2 hours using ReelBoost! The quality of engagement is outstanding.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How to place an order?",
      answer: "It's simple! Sign in, select your platform (Instagram, YouTube, etc.), choose the service you need, paste your content link, select quantity, and confirm payment. Orders start processing within minutes."
    },
    {
      question: "Is it safe to use?",
      answer: "Absolutely! We use industry-standard encryption and work only with verified, high-quality service providers. Your account information is never shared, and all engagement is 100% real."
    },
    {
      question: "How long does delivery take?",
      answer: "Most orders start processing within 5-10 minutes. Full delivery time varies by service, typically ranging from 30 minutes to 24 hours depending on the quantity and platform."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI payments, and you can top up your wallet easily. All transactions are secure and encrypted."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes! If a service fails to deliver or doesn't meet our quality standards, you can request a refund. We also offer instant order cancellation before processing begins."
    },
    {
      question: "Do you offer discounts for bulk orders?",
      answer: "Yes! Join our reseller program to get special discounts and earn commissions. Contact our support team to learn more about bulk pricing."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">ReelBoost</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-8">
            <Badge className="px-4 py-2 text-sm font-medium" variant="secondary" data-testid="badge-realviews">
              <CheckCircle className="h-4 w-4 mr-2 inline" />
              100% Real Views & Engagement
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Boost Your Reels
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-[hsl(var(--accent-green))] bg-clip-text text-transparent">
                Instantly & Securely
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional SMM panel for Instagram, YouTube, TikTok, and more. 
              Get real views, likes, and followers with our automated, reliable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild data-testid="button-get-started" className="text-lg px-8">
                <a href="/login">Get Started Free</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <a href="#features">Learn More</a>
              </Button>
            </div>

            {/* Live Example Banner */}
            <Card className="max-w-2xl mx-auto mt-8 border-[hsl(var(--accent-green))] bg-gradient-to-r from-primary/5 to-[hsl(var(--accent-green))]/5" data-testid="card-example">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[hsl(var(--accent-green))]" />
                  <p className="text-base md:text-lg font-semibold">
                    This reel got <span className="text-primary">10K views</span> in{" "}
                    <span className="text-[hsl(var(--accent-green))]">2 hours</span>!
                  </p>
                  <Zap className="h-6 w-6 text-primary animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-8 flex-wrap pt-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <div className={`${platform.color}`}>
                  <platform.icon className="h-8 w-8" />
                </div>
                <span className="text-xs text-muted-foreground">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-y py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                <stat.icon className="h-10 w-10 mx-auto text-primary" />
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-green))] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose ReelBoost?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of businesses and influencers worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="hover-elevate" data-testid={`feature-${feature.title.toLowerCase().replace(/\s/g, '-')}`}>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="bg-card border-y py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted & Secure</h2>
            <p className="text-muted-foreground">Your security is our top priority</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Lock className="h-6 w-6 text-primary" />
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Award className="h-6 w-6 text-primary" />
              <span className="font-medium">Verified Services</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="font-medium">Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers growing their social presence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="hover-elevate" data-testid={`testimonial-${idx}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-card border-y py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about ReelBoost
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} data-testid={`faq-${idx}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-[hsl(var(--accent-green))]/10 border-primary/20">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Boost Your Social Media?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join thousands of satisfied customers and start growing your presence today
            </p>
            <Button size="lg" asChild data-testid="button-cta-start" className="text-lg px-8">
              <a href="/login">Start Now - It's Free</a>
            </Button>
            <p className="text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              No credit card required • Instant setup • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>© 2025 ReelBoost. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Share2,
  Video,
  MessageCircle,
  Hash,
  Globe,
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
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const platforms = [
    { icon: Share2, name: "Instagram", color: "text-pink-500" },
    { icon: Video, name: "YouTube", color: "text-red-500" },
    { icon: MessageCircle, name: "Facebook", color: "text-blue-600" },
    { icon: Hash, name: "Twitter/X", color: "text-sky-500" },
    { icon: Globe, name: "TikTok", color: "text-purple-500" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Orders start processing within 5-10 minutes of placement",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade encryption and secure payment processing",
    },
    {
      icon: DollarSign,
      title: "Best Pricing",
      description: "Competitive rates starting from ₹0.50 per 1K",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your needs",
    },
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Happy Clients" },
    { icon: TrendingUp, value: "1M+", label: "Orders Delivered" },
    { icon: Award, value: "99.9%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Content Creator",
      image: "PS",
      content: "ReelBoost transformed my Instagram presence! Went from 5K to 50K followers in just 3 months with 100% real engagement.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Digital Marketer",
      image: "RV",
      content: "The best SMM panel I've ever used. Lightning-fast delivery, transparent pricing, and exceptional customer support.",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Influencer",
      image: "AD",
      content: "My reels consistently hit 10K+ views within hours thanks to ReelBoost. The quality of engagement is outstanding!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How quickly can I expect results?",
      answer: "Most orders begin processing within 5-10 minutes. Delivery times vary by service, typically ranging from 30 minutes to 24 hours depending on quantity and platform."
    },
    {
      question: "Is my account information safe?",
      answer: "Absolutely! We use bank-grade encryption and never ask for your passwords. All engagement comes from real, verified accounts, ensuring your complete safety and privacy."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI payments for easy wallet top-ups. All transactions are secure, encrypted, and processed instantly."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a money-back guarantee if services don't meet our quality standards. You can also request instant order cancellation before processing begins."
    },
    {
      question: "Do you offer bulk order discounts?",
      answer: "Yes! Join our reseller program to access special discounts and earn commissions. Contact our support team to learn about bulk pricing options."
    },
    {
      question: "How do I track my order progress?",
      answer: "Every order can be tracked in real-time through your dashboard. You'll receive instant notifications about order status changes and completion."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 z-50 shadow-sm" role="banner">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between" aria-label="Main navigation">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
              <TrendingUp className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">ReelBoost</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
            <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
              <a href="/login">Sign In</a>
            </Button>
          </motion.div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12"
              initial="initial"
              animate={mounted ? "animate" : "initial"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge className="px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-shadow" variant="secondary">
                  <Sparkles className="h-4 w-4 mr-2 inline" aria-hidden="true" />
                  <span>100% Real & Organic Engagement</span>
                </Badge>
              </motion.div>
              
              <motion.h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
                variants={fadeInUp}
              >
                Grow Your Social Media
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent">
                  Instantly & Authentically
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
                variants={fadeInUp}
              >
                Professional SMM panel delivering real engagement across Instagram, YouTube, TikTok, and more. 
                Trusted by 50,000+ creators worldwide.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4"
                variants={fadeInUp}
              >
                <Button size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-lg hover:shadow-xl transition-all group">
                  <a href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-md hover:shadow-lg transition-all">
                  <a href="#features">Learn More</a>
                </Button>
              </motion.div>

              {/* Social Proof Banner */}
              <motion.div variants={fadeInUp}>
                <Card className="max-w-2xl mx-auto mt-8 border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" aria-hidden="true" />
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-center">
                        <span className="text-primary">10,000+ views</span> delivered in{" "}
                        <span className="text-purple-600">just 2 hours</span>!
                      </p>
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 animate-pulse flex-shrink-0" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Platform Icons */}
            <motion.div 
              className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 flex-wrap pt-4 sm:pt-8"
              initial="initial"
              animate={mounted ? "animate" : "initial"}
              variants={staggerContainer}
            >
              {platforms.map((platform, idx) => (
                <motion.div 
                  key={platform.name}
                  className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-default"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={`${platform.color}`}>
                    <platform.icon className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" aria-hidden="true" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">{platform.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-b from-card to-background border-y py-12 sm:py-16" aria-label="Platform statistics">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  className="text-center space-y-3 p-4"
                  variants={fadeInUp}
                >
                  <stat.icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary" aria-hidden="true" />
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24" aria-labelledby="features-heading">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
            <motion.h2 
              id="features-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose ReelBoost?
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of successful creators and businesses worldwide
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center shadow-md">
                      <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Trust Signals Section */}
        <section className="bg-gradient-to-b from-card/50 to-background border-y py-12 sm:py-16" aria-label="Security and trust">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-10 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Trusted & Secure</h2>
              <p className="text-muted-foreground text-base sm:text-lg">Your security and privacy are our top priorities</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { icon: Lock, text: "SSL Encrypted" },
                { icon: Shield, text: "Secure Payments" },
                { icon: Award, text: "Verified Services" },
                { icon: CheckCircle, text: "Money-Back Guarantee" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium text-sm sm:text-base">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24" aria-labelledby="testimonials-heading">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
            <motion.h2 
              id="testimonials-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Loved by Creators Worldwide
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              See what our satisfied customers have to say
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50">
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-1" role="img" aria-label={`${testimonial.rating} star rating`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-bold text-sm sm:text-base text-primary">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gradient-to-b from-card/50 to-background border-y py-16 sm:py-20 lg:py-24" aria-labelledby="faq-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
              <motion.h2 
                id="faq-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Everything you need to know about our services
              </motion.p>
            </div>
            
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="border rounded-lg px-4 sm:px-6 bg-card/50 hover:bg-card transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24" aria-labelledby="cta-heading">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10 border-primary/30 shadow-2xl overflow-hidden">
              <CardContent className="p-8 sm:p-10 lg:p-12 text-center space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                    Ready to Grow Your Social Media?
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                    Join 50,000+ satisfied creators and start your growth journey today
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                  <Button size="lg" asChild className="text-base sm:text-lg px-8 h-12 sm:h-14 shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto group">
                    <a href="/login">
                      Start Growing Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-sm sm:text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span>Instant setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

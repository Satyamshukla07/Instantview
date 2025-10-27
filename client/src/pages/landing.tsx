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
  Sparkles,
  ShoppingCart
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
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
import heroPhone from "@assets/stock_images/modern_smartphone_so_6afcad9f.jpg";
import heroBg from "@assets/stock_images/abstract_digital_mar_56f932e4.jpg";
import heroCreator from "@assets/stock_images/happy_content_creato_56d62704.jpg";
import heroEngagement from "@assets/stock_images/social_media_engagem_027ba258.jpg";

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
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 glass-strong z-50 border-b border-border/50" role="banner">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" aria-label="Main navigation">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight gradient-text">ReelBoost</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ThemeToggle />
            <Button asChild size="lg" className="btn-gradient shadow-lg hover:shadow-xl transition-all hover:scale-105" data-testid="button-sign-in">
              <a href="/login">Sign In</a>
            </Button>
          </motion.div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]">
              {/* Text Content */}
              <motion.div 
                className="space-y-6 sm:space-y-8 lg:order-1"
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
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1]"
                  variants={fadeInUp}
                >
                  Boost Your Reels
                  <br />
                  <span className="gradient-text">
                    Instantly & Authentically
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
                  variants={fadeInUp}
                >
                  Get real Instagram followers, YouTube views, TikTok likes & more. Lightning-fast delivery, 100% secure, trusted by 50,000+ creators worldwide.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
                  variants={fadeInUp}
                >
                  <Button size="lg" asChild className="text-base sm:text-lg px-8 sm:px-10 h-13 sm:h-15 shadow-lg hover:shadow-2xl transition-all group bg-gradient-to-r from-primary to-secondary hover:scale-105" data-testid="button-hero-cta">
                    <a href="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-8 sm:px-10 h-13 sm:h-15 shadow-md hover:shadow-xl transition-all hover:scale-105 border-2">
                    <a href="#features">Learn More</a>
                  </Button>
                </motion.div>

                {/* Social Proof Banner */}
                <motion.div variants={fadeInUp} className="mt-8">
                  <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 shadow-xl gradient-bg-animated">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" aria-hidden="true" />
                        <p className="text-sm sm:text-base font-bold text-center">
                          <span className="text-primary">10,000+ views</span> delivered in{" "}
                          <span className="text-secondary">2 hours</span>!
                        </p>
                        <Zap className="h-6 w-6 text-secondary animate-pulse flex-shrink-0" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Hero Visual with Images */}
              <motion.div 
                className="lg:order-2 relative flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative w-full h-[500px] sm:h-[600px]">
                  {/* Background gradient with image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 rounded-3xl overflow-hidden">
                    <img 
                      src={heroBg} 
                      alt="Digital marketing background"
                      className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                  </div>
                  
                  {/* Main creator image - bottom left */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-48 sm:w-64 h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10" />
                      <img 
                        src={heroCreator} 
                        alt="Happy content creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Phone mockup - center right */}
                  <motion.div
                    className="absolute top-1/2 right-8 -translate-y-1/2 w-56 sm:w-72"
                    animate={{
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-3xl opacity-50 rounded-full" />
                      
                      {/* Phone image */}
                      <img 
                        src={heroPhone} 
                        alt="Social media app interface"
                        className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Engagement icons card - top left */}
                  <motion.div
                    className="absolute top-8 left-8 w-32 sm:w-40 h-32 sm:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20"
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 z-10" />
                      <img 
                        src={heroEngagement} 
                        alt="Social media engagement"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Floating stat cards */}
                  <motion.div
                    className="absolute top-4 right-4 glass p-3 sm:p-4 rounded-2xl shadow-xl border border-border/50"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold gradient-text">1M+</div>
                        <div className="text-xs text-muted-foreground">Orders</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 right-4 glass p-3 sm:p-4 rounded-2xl shadow-xl border border-border/50"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold gradient-text">99.9%</div>
                        <div className="text-xs text-muted-foreground">Success</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Platform Icons */}
            <motion.div 
              className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 flex-wrap pt-12 sm:pt-16"
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

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/9876543210?text=Hi%2C%20I%20need%20help%20with%20ReelBoost"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-whatsapp-float"
        aria-label="Contact us on WhatsApp"
      >
        <SiWhatsapp className="w-7 h-7" />
        <span className="sr-only">Contact us on WhatsApp</span>
      </motion.a>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-2xl z-40 p-3">
        <div className="flex gap-2">
          <Button asChild size="lg" className="flex-1 text-base shadow-lg" data-testid="button-mobile-cta-order">
            <a href="/signup" className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Place Order
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1 text-base bg-[#25D366] hover:bg-[#128C7E] text-white border-none" data-testid="button-mobile-cta-whatsapp">
            <a 
              href="https://wa.me/9876543210?text=Hi%2C%20I%20need%20help%20with%20ReelBoost"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <SiWhatsapp className="h-5 w-5" />
              WhatsApp Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

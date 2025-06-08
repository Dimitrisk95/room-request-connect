
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminAccessDialog from "@/components/login/AdminAccessDialog";
import Footer from "@/components/ui/footer";
import { 
  Building, 
  Users, 
  MessageSquare, 
  Calendar,
  Shield,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Star,
  Check
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "Roomlix - Hotel Management System";
  }, []);

  const features = [
    {
      icon: Building,
      title: "Room Management",
      description: "Track room status, manage housekeeping, and optimize occupancy rates in real-time."
    },
    {
      icon: Users,
      title: "Staff Coordination",
      description: "Assign tasks, manage permissions, and streamline communication across your team."
    },
    {
      icon: MessageSquare,
      title: "Guest Requests",
      description: "Handle guest requests efficiently with automated assignment and tracking."
    },
    {
      icon: Calendar,
      title: "Reservation System",
      description: "Manage bookings, check-ins, and check-outs with integrated calendar views."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "GDPR compliant with enterprise-grade security and data protection."
    },
    {
      icon: Zap,
      title: "Analytics & Reports",
      description: "Make data-driven decisions with comprehensive analytics and insights."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Hotel Manager",
      hotel: "Grand Plaza Hotel",
      quote: "Roomlix transformed our operations. Staff efficiency increased by 40% and guest satisfaction scores are at an all-time high.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Operations Director", 
      hotel: "Boutique Suites",
      quote: "The mobile-first design means our housekeeping staff can update room status instantly. It's a game-changer.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Front Desk Supervisor",
      hotel: "City Center Inn",
      quote: "Guest requests are handled so much faster now. The automation features save us hours every day.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small hotels getting started",
      features: [
        "Up to 25 rooms",
        "Basic request management", 
        "Staff coordination",
        "Mobile access",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For growing hotels needing advanced features",
      features: [
        "Up to 100 rooms",
        "Advanced analytics",
        "Guest feedback system",
        "API access",
        "Priority support",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For hotel chains and large properties",
      features: [
        "Unlimited rooms",
        "Multi-property management",
        "Advanced integrations",
        "Dedicated account manager",
        "Custom features",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Roomlix</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link to="/guest-connect">Guest Access</Link>
            </Button>
            <AdminAccessDialog />
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Globe className="mr-2 h-3 w-3" />
              Trusted by 1000+ hotels worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hotel Management
              <span className="text-primary block">Made Simple</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your hotel operations with our comprehensive management platform. 
              From room tracking to guest requests, everything you need in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <AdminAccessDialog />
              <Button asChild variant="outline" size="lg">
                <Link to="/demo">
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 bg-muted/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Your Hotel Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance every aspect of your hotel operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Hotel Professionals
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <cite className="font-semibold not-italic">{testimonial.name}</cite>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.hotel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container px-4 py-16 bg-muted/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your hotel's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Hotel?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of hotels already using Roomlix to deliver exceptional guest experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

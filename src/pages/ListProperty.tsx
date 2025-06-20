
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const ListProperty = () => {
  const benefits = [
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Streamline your reservation system with our intuitive booking management tools."
    },
    {
      icon: MessageSquare,
      title: "Handle Guest Requests",
      description: "Efficiently manage and respond to guest requests and service inquiries in real-time."
    },
    {
      icon: Users,
      title: "Full Staff Control",
      description: "Manage your team with role-based permissions and task assignment features."
    },
    {
      icon: BarChart3,
      title: "Hotel Analytics",
      description: "Get detailed insights into your hotel's performance with comprehensive analytics."
    }
  ];

  const features = [
    "Real-time room status tracking",
    "Automated guest communication",
    "Staff performance monitoring",
    "Revenue optimization tools",
    "Multi-platform accessibility",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Roomlix</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link to="/guest-connect">Guest Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Hotel Owner Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
          <div className="container px-4 py-20 md:py-28">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                List Your Hotel on
                <span className="text-primary block">Roomlix Platform</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of hotel owners who trust Roomlix to streamline their operations, 
                increase bookings, and deliver exceptional guest experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                  <Link to="/hotel-setup">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Start Listing
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                  <Link to="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Roomlix?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage your hotel efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features List */}
        <section className="bg-muted/50 py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything You Need
                </h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive tools for modern hotel management
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Hotels Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              Join our growing community of successful hotel owners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Bank-level security with 99.9% uptime guarantee
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Round-the-clock assistance for you and your guests
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-muted-foreground">
                  Increase efficiency by 40% and guest satisfaction by 35%
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Set up your hotel on Roomlix in just a few minutes and start managing 
              your property more efficiently today.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/hotel-setup">
                Start Your Hotel Setup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ListProperty;

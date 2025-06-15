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
  Check,
  Search,
  MapPin,
  Heart,
  CreditCard,
  UserCheck,
  Clock
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "Roomlix - Hotel Booking & Management Platform";
  }, []);

  const hotelFeatures = [
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
    }
  ];

  const guestFeatures = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find the perfect hotel with advanced filters and real-time availability."
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Book with confidence using our secure payment system and verified properties."
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Chat directly with hotel staff for special requests and instant support."
    },
    {
      icon: Award,
      title: "Best Price Guarantee",
      description: "Get the best rates with our price matching and exclusive member deals."
    }
  ];

  const featuredHotels = [
    {
      name: "Grand Palace Hotel",
      location: "New York, NY",
      rating: 4.8,
      price: "$299",
      image: "photo-1721322800607-8c38375eef04",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant"]
    },
    {
      name: "Coastal Resort & Spa",
      location: "Miami, FL",
      rating: 4.9,
      price: "$399",
      image: "photo-1472396961693-142e6e269027",
      amenities: ["Beach", "WiFi", "Pool", "Gym"]
    },
    {
      name: "Mountain View Lodge",
      location: "Aspen, CO",
      rating: 4.7,
      price: "$249",
      image: "photo-1721322800607-8c38375eef04",
      amenities: ["Ski Access", "WiFi", "Restaurant", "Spa"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Hotels Listed" },
    { number: "500K+", label: "Happy Guests" },
    { number: "150+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Roomlix</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/hotels" className="text-sm font-medium hover:text-primary">Browse Hotels</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">Support</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link to="/guest-connect">Guest Login</Link>
            </Button>
            <AdminAccessDialog />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Dual Purpose */}
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
          <div className="container px-4 py-20 md:py-28">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              <Badge variant="outline" className="mb-4">
                <Globe className="mr-2 h-3 w-3" />
                The Complete Hotel Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Book Amazing Hotels
                <span className="text-primary block">Manage Them Better</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're a traveler seeking the perfect stay or a hotel owner looking to streamline operations, 
                Roomlix is your all-in-one platform for exceptional hospitality experiences.
              </p>
              
              {/* Dual CTA */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <div className="text-center">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                    <Search className="mr-2 h-5 w-5" />
                    Find Hotels
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">For Travelers</p>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                    <Building className="mr-2 h-5 w-5" />
                    List Your Hotel
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">For Hotel Owners</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Hotels Section */}
        <section className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Hotels
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover exceptional properties around the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHotels.map((hotel, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] bg-muted relative">
                  <img 
                    src={`https://images.unsplash.com/${hotel.image}?auto=format&fit=crop&w=400&h=300`}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Heart className="h-6 w-6 text-white/80 hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.map((amenity, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold">{hotel.price}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                    <Button size="sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section - For Travelers */}
        <section className="bg-muted/50 py-16">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Travelers Choose Roomlix
              </h2>
              <p className="text-xl text-muted-foreground">
                Book with confidence using our traveler-focused features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {guestFeatures.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
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
          </div>
        </section>

        {/* Features Section - For Hotel Owners */}
        <section className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Management Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything hotel owners need to run their business efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotelFeatures.map((feature, index) => (
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

        {/* Trust & Security Section */}
        <section className="bg-muted/50 py-16">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Book & Manage with Confidence
              </h2>
              <p className="text-xl text-muted-foreground">
                Industry-leading security and support for all users
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground">
                    All payments protected with bank-level encryption and fraud detection
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <UserCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
                  <p className="text-muted-foreground">
                    All hotels verified and quality-checked by our expert team
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Round-the-clock assistance for guests and hotel owners
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Roomlix?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of travelers and hotel owners who trust Roomlix for exceptional hospitality experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Booking Hotels
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                List Your Property
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

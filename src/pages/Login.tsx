
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Staff login form
  const [staffCredentials, setStaffCredentials] = useState({
    email: "",
    password: "",
    role: "admin" as "admin" | "staff",
  });

  // Guest login form
  const [guestCredentials, setGuestCredentials] = useState({
    roomCode: "",
    roomNumber: "",
  });

  // Handle staff login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(
        staffCredentials.email,
        staffCredentials.password,
        staffCredentials.role
      );
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest login
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginAsGuest(
        guestCredentials.roomCode,
        guestCredentials.roomNumber
      );
      navigate(`/guest/${guestCredentials.roomCode}`);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid room code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Hotel className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Room Request Connect</h1>
          <p className="text-muted-foreground mt-2">
            Connect with your hotel for a seamless stay
          </p>
        </div>

        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="staff">Staff & Management</TabsTrigger>
            <TabsTrigger value="guest">Guests</TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Login</CardTitle>
                <CardDescription>
                  Login to manage your hotel's rooms and requests
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleStaffLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full p-2 border rounded-md"
                      value={staffCredentials.role}
                      onChange={(e) =>
                        setStaffCredentials({
                          ...staffCredentials,
                          role: e.target.value as "admin" | "staff",
                        })
                      }
                    >
                      <option value="admin">Hotel Management</option>
                      <option value="staff">Staff Member</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={staffCredentials.email}
                      onChange={(e) =>
                        setStaffCredentials({
                          ...staffCredentials,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={staffCredentials.password}
                      onChange={(e) =>
                        setStaffCredentials({
                          ...staffCredentials,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="guest">
            <Card>
              <CardHeader>
                <CardTitle>Guest Access</CardTitle>
                <CardDescription>
                  Enter your room code to access services
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleGuestLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      type="text"
                      placeholder="e.g. 101"
                      value={guestCredentials.roomNumber}
                      onChange={(e) =>
                        setGuestCredentials({
                          ...guestCredentials,
                          roomNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomCode">Room Access Code</Label>
                    <Input
                      id="roomCode"
                      type="text"
                      placeholder="Enter the code provided by your hotel"
                      value={guestCredentials.roomCode}
                      onChange={(e) =>
                        setGuestCredentials({
                          ...guestCredentials,
                          roomCode: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect to Room"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Admin: admin@hotel.com / admin123</p>
          <p>Staff: staff@hotel.com / staff123</p>
          <p>Guest: Room 101 / Code: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/ui/dashboard-shell";

const StaffManagement = () => {
  const { user, createStaffAccount, signupCode, generateNewSignupCode } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as "admin" | "staff"
  });

  if (user?.role !== "admin") {
    return (
      <DashboardShell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Only administrators can access the staff management page.</p>
        </div>
      </DashboardShell>
    );
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Pass the user's hotelId to ensure staff are created for the admin's hotel
      await createStaffAccount(
        newStaff.name,
        newStaff.email,
        newStaff.password,
        newStaff.role,
        user.hotelId
      );
      
      toast({
        title: "Staff account created",
        description: `${newStaff.name} has been added as ${newStaff.role}.`,
      });
      
      setNewStaff({
        name: "",
        email: "",
        password: "",
        role: "staff"
      });
    } catch (error) {
      toast({
        title: "Failed to create account",
        description: "There was an error creating the staff account.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copySignupCode = () => {
    navigator.clipboard.writeText(signupCode);
    toast({
      title: "Copied to clipboard",
      description: "Signup code has been copied to clipboard."
    });
  };
  
  const handleGenerateNewCode = () => {
    generateNewSignupCode();
    toast({
      title: "New code generated",
      description: "A new signup code has been generated."
    });
  };

  return (
    <DashboardShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
        
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="create">Create Account</TabsTrigger>
            <TabsTrigger value="signup-code">Signup Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Create Staff Account</CardTitle>
                <CardDescription>
                  Add new staff members to the hotel management system
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateStaff}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full p-2 border rounded-md"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as "admin" | "staff" })}
                    >
                      <option value="staff">Staff Member</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup-code">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Staff Signup Code</CardTitle>
                <CardDescription>
                  Staff can use this code to sign up with Google
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Current Signup Code</p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-secondary p-3 rounded-md text-lg font-mono tracking-wider flex-1 text-center">
                      {signupCode}
                    </div>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={copySignupCode} 
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This code automatically refreshes daily at midnight.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGenerateNewCode}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Code
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default StaffManagement;

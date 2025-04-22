
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";

interface AdminRegistrationFormProps {
  onRegistered: () => void;
  onCancel: () => void;
}

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ onRegistered, onCancel }) => {
  const { createStaffAccount } = useAuth();
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    hotelId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStaffAccount(
        values.name,
        values.email,
        values.password,
        "admin",
        values.hotelId
      );
      toast({
        title: "Admin account created",
        description: "You can now login as admin.",
      });
      onRegistered();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create admin account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Register Admin</CardTitle>
        <CardDescription>
          Create a new admin account for your hotel (web only)
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelId">Hotel Code</Label>
            <Input
              id="hotelId"
              name="hotelId"
              type="text"
              placeholder="Enter your hotel code"
              value={values.hotelId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register Admin"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminRegistrationForm;


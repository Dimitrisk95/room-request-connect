
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use a default hotel code for admin login.
      await login(form.email, form.password, "550e8400-e29b-41d4-a716-446655440000");
      toast({
        title: "Admin login successful",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Admin email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login as Admin"}
      </Button>
    </form>
  );
};

export default AdminLoginForm;

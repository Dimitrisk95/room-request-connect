
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

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
      await login(form.email, form.password, "550e8400-e29b-41d4-a716-446655440000");
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your admin account.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Input
          name="email"
          type="email"
          placeholder="Admin email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          className="border-input/60 focus:border-primary"
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="border-input/60 focus:border-primary"
          required
        />
      </div>
      <Button 
        className="w-full bg-primary hover:bg-primary/90" 
        type="submit" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login as Admin"
        )}
      </Button>
    </form>
  );
};

export default AdminLoginForm;

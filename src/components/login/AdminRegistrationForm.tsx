import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Info, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AdminRegistrationFormProps {
  onRegistered: () => void;
  onCancel: () => void;
}

// Update schema: remove hotelId, add confirmPassword and cross-field validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your password"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ onRegistered, onCancel }) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Check password strength
  useEffect(() => {
    const password = form.watch("password");
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains number
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [form.watch("password")]);

  // Check if passwords match
  useEffect(() => {
    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");
    
    if (!confirmPassword) {
      setPasswordMatch(null);
      return;
    }
    
    setPasswordMatch(password === confirmPassword);
  }, [form.watch("password"), form.watch("confirmPassword")]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-destructive";
    if (passwordStrength < 75) return "bg-amber-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Starting admin account creation for:", values.email);
      await signUp(values.email, values.password, values.name);
      
      console.log("Admin account created successfully");
      toast({
        title: "Admin account created",
        description: "You can now login as admin.",
      });
      onRegistered();
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Extract meaningful error message
      let errorMessage = "Could not create admin account.";
      
      if (error.message) {
        if (error.message.includes("already exists")) {
          errorMessage = error.message;
        } else if (error.message.includes("User already registered")) {
          errorMessage = "A user with this email is already registered. Try logging in instead.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-start text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  {field.value && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        {passwordStrength >= 75 ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                        ) : passwordStrength >= 50 ? (
                          <Shield className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <ShieldX className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span>{getPasswordStrengthText()} password</span>
                      </div>
                      <Progress value={passwordStrength} className={`h-1 ${getPasswordStrengthColor()}`} />
                    </div>
                  )}
                  <FormDescription className="flex items-start text-xs mt-1">
                    <Info className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
                    Use at least 8 characters with a mix of letters, numbers, and symbols
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...field} 
                        className={passwordMatch === false ? "border-destructive" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  {passwordMatch === false && field.value && (
                    <p className="text-destructive text-xs flex items-center mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                  {passwordMatch === true && field.value && (
                    <p className="text-green-500 text-xs flex items-center mt-1">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                      Passwords match
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || passwordMatch === false} 
              className="w-full"
            >
              {loading ? "Registering..." : "Register Admin"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AdminRegistrationForm;

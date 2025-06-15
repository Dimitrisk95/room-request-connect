import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Info, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { registerFormSchema, type RegisterFormValues } from "./schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import EmailVerificationPrompt from "@/components/auth/EmailVerificationPrompt";

export function RegisterForm() {
  const { createStaffAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
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

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Starting admin account creation for:", values.email);
      await createStaffAccount(
        values.name,
        values.email,
        values.password,
        "admin"
      );
      
      console.log("Admin account created successfully");
      setRegisteredEmail(values.email);
      setShowEmailVerification(true);
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Could not create account.";
      
      if (error.message) {
        if (error.message.includes("already exists") || 
            error.message.includes("User already registered") || 
            error.message.includes("duplicate key value") ||
            error.message.includes("users_email_key")) {
          errorMessage = "A user with this email is already registered. Please try logging in instead.";
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

  const handleEmailVerified = () => {
    toast({
      title: "Email verified!",
      description: "Your account is now active. You can log in.",
    });
    navigate("/login?verified=true");
  };

  if (showEmailVerification) {
    return (
      <EmailVerificationPrompt
        email={registeredEmail}
        onVerified={handleEmailVerified}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
                <Input type="email" placeholder="your@email.com" {...field} />
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

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || passwordMatch === false}
        >
          {loading ? "Creating Account..." : "Create Admin Account"}
        </Button>
      </form>
    </Form>
  );
}

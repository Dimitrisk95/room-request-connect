
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Loader, Check } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const loginFormSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password, "550e8400-e29b-41d4-a716-446655440000");
      
      setShowSuccess(true);
      
      // Show success toast
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your admin account.",
      });
      
      // Delay closing the dialog to show success state
      setTimeout(() => {
        onSuccess();
      }, 1000);
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Admin email"
                    type="email"
                    disabled={loading || showSuccess}
                    className="border-input/60 focus:border-primary"
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
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    disabled={loading || showSuccess}
                    className="border-input/60 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            className={`w-full ${showSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'}`} 
            type="submit" 
            disabled={loading || showSuccess}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : showSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Login Successful
              </>
            ) : (
              "Login as Admin"
            )}
          </Button>
          
          <div className="text-center mt-2">
            <button 
              type="button"
              className="text-sm text-primary hover:underline" 
              onClick={() => form.reset()}
              disabled={loading || showSuccess}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </Form>
      
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Login Successful</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully logged in to your admin account.
              Redirecting to dashboard...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminLoginForm;

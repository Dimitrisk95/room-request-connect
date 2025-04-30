
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  initialEmail?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onBackToLogin,
  initialEmail = ""
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First, verify if the user exists in our users table
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('name, hotel_id')
        .eq('email', email)
        .single();
      
      if (userDataError) {
        console.error("Error checking user:", userDataError);
        toast({
          title: "Account not found",
          description: "We couldn't find an account with that email address.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // If we have a user, invoke the password reset function
      const { error } = await supabase.functions.invoke('reset-password-email', {
        body: { 
          email,
          name: userData.name || "User", 
          hotelName: userData.hotel_id ? "your hotel" : undefined
        }
      });

      if (error) {
        console.error("Error sending password reset email:", error);
        throw error;
      }
      
      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      });
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <Mail className="mx-auto h-12 w-12 text-primary" />
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <p className="text-sm text-muted-foreground">
                Check your email inbox and follow the instructions to reset your password.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {isSuccess ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBackToLogin}
            >
              Back to login
            </Button>
          ) : (
            <>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center"
                onClick={onBackToLogin}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PasswordSetupFormProps {
  email: string;
  onComplete: () => void;
}

const PasswordSetupForm: React.FC<PasswordSetupFormProps> = ({ email, onComplete }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) throw updateError;
      
      // Update the users table to mark password as set up
      const { error: dbError } = await supabase
        .from('users')
        .update({ needs_password_setup: false })
        .eq('email', email);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Password set successfully",
        description: "Your password has been set. You can now access the system.",
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Password setup error:", error);
      setError(error.message || "Failed to set password. Please try again.");
      
      toast({
        title: "Failed to set password",
        description: error.message || "There was an error setting your password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Password</CardTitle>
        <CardDescription>
          Please set up a secure password for your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a secure password"
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up...
              </>
            ) : (
              "Set Password & Continue"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordSetupForm;

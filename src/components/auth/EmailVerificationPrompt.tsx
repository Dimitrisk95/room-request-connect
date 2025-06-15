
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useAuthVerification } from "@/hooks/auth/use-auth-verification";
import { useAuth } from "@/context";

interface EmailVerificationPromptProps {
  email: string;
  onVerified: () => void;
}

const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({ 
  email, 
  onVerified 
}) => {
  const { resendVerificationEmail, checkEmailVerification, isResending } = useAuthVerification();
  const [isChecking, setIsChecking] = useState(false);
  const [lastResent, setLastResent] = useState<Date | null>(null);

  const handleResendEmail = async () => {
    await resendVerificationEmail(email);
    setLastResent(new Date());
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        onVerified();
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check verification status periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        onVerified();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [checkEmailVerification, onVerified]);

  const canResend = !lastResent || Date.now() - lastResent.getTime() > 60000; // 1 minute

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please check your email and click the verification link to continue.
            Don't forget to check your spam folder!
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleCheckVerification} 
            className="w-full"
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                I've verified my email
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            disabled={isResending || !canResend}
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>

          {!canResend && (
            <p className="text-xs text-muted-foreground text-center">
              Please wait before requesting another email
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationPrompt;


import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hotel } from "lucide-react";
import { RegisterForm } from "@/components/register/RegisterForm";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Hotel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Roomlix</h1>
          </div>
          <h2 className="text-xl font-semibold">Create Your Admin Account</h2>
          <p className="text-muted-foreground text-sm">
            Get started with your hotel management system
          </p>
        </div>

        {/* Back button */}
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 p-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
        
        {/* Registration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create your administrator account to start managing your hotel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <RegisterForm />
          </CardContent>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                Sign in here
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

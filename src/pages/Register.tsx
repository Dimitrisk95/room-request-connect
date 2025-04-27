
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoginHeader from "@/components/login/LoginHeader";
import { RegisterForm } from "@/components/register/RegisterForm";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <div className="w-full max-w-md px-4">
        <LoginHeader />
        
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 p-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register as a hotel administrator
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <RegisterForm />
          </CardContent>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                Login
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;


import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { StaffTable } from "./StaffTable";
import { AccessDeniedCard } from "./AccessDeniedCard";

const RoleManagementPage = () => {
  const { user } = useAuth();
  
  if (user?.role !== "admin") {
    return <AccessDeniedCard />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Staff Role Management
        </CardTitle>
        <CardDescription>
          Manage roles and permissions for your hotel staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StaffTable />
      </CardContent>
    </Card>
  );
};

export default RoleManagementPage;

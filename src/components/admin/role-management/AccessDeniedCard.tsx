
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const AccessDeniedCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>
          Only administrators can manage staff roles.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

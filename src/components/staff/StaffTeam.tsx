
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const StaffTeam = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Team</CardTitle>
        <CardDescription>
          Your colleagues who are helping with guest requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Avatar>
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Staff Member</div>
              <div className="text-sm text-muted-foreground">Maintenance</div>
            </div>
            <Badge variant="outline" className="ml-2 bg-success/10 text-success">
              Online
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Jane Doe</div>
              <div className="text-sm text-muted-foreground">Housekeeping</div>
            </div>
            <Badge variant="outline" className="ml-2 bg-success/10 text-success">
              Online
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Avatar>
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Robert Smith</div>
              <div className="text-sm text-muted-foreground">Room Service</div>
            </div>
            <Badge variant="outline" className="ml-2">
              Offline
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffTeam;

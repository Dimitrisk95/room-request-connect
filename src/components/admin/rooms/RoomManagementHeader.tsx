
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bed } from "lucide-react";

export const RoomManagementHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center">
        <Bed className="mr-2 h-5 w-5" />
        Hotel Room Management
      </CardTitle>
      <CardDescription>
        Manage the rooms in your hotel
      </CardDescription>
    </CardHeader>
  );
};

export default RoomManagementHeader;

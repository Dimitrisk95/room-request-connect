
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface StaffAddedCardProps {
  count: number;
}

export const StaffAddedCard = ({ count }: StaffAddedCardProps) => {
  return (
    <Card className="bg-muted/30 p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center">
          <Check className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium">
            {count} {count === 1 ? 'Staff Member' : 'Staff Members'} Added
          </h3>
          <p className="text-sm text-muted-foreground">
            You can add more staff or continue with setup
          </p>
        </div>
      </div>
    </Card>
  );
};

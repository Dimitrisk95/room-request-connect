
import { Card } from "@/components/ui/card";
import { Check, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffAddedCardProps {
  count: number;
  onAddAnother: () => void;
}

export const StaffAddedCard = ({ count, onAddAnother }: StaffAddedCardProps) => {
  return (
    <Card className="bg-muted/30 p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center">
          <Check className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            {count} {count === 1 ? 'Staff Member' : 'Staff Members'} Added
          </h3>
          <p className="text-sm text-muted-foreground">
            You can add more staff or continue with setup
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={onAddAnother}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Another
        </Button>
      </div>
    </Card>
  );
};

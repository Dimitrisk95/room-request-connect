
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { SetupData } from "../SetupWizard";
import { StaffAddedCard } from "./components/StaffAddedCard";
import { AddStaffForm } from "./components/AddStaffForm";

interface StaffSetupStepProps {
  staffData: SetupData["staff"];
  updateStaffData: (data: Partial<SetupData["staff"]>) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const StaffSetupStep: React.FC<StaffSetupStepProps> = ({
  staffData,
  updateStaffData,
  onNext,
  onSkip,
  onBack
}) => {
  const { createdStaff } = staffData;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Users className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Add Staff</h2>
      </div>
      
      <p className="text-muted-foreground">
        Add staff members who will be using the system. You can add administrators and staff members.
        You can always add more staff later.
      </p>

      {createdStaff > 0 && <StaffAddedCard count={createdStaff} />}

      <AddStaffForm 
        updateStaffData={updateStaffData}
        createdStaff={createdStaff}
      />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        {createdStaff > 0 ? (
          <Button onClick={onNext}>Continue</Button>
        ) : (
          <Button variant="secondary" onClick={onSkip}>
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffSetupStep;

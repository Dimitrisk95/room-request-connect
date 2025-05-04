
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";
import NavigationButtons from "./NavigationButtons";
import { SetupData } from "../SetupWizard";
import AddStaffForm from "./components/AddStaffForm";
import StaffAddedCard from "./components/StaffAddedCard";

interface StaffSetupStepProps {
  staffData: SetupData["staff"];
  updateStaffData: (data: Partial<SetupData["staff"]>) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  skipToCompletion?: () => void;
}

const StaffSetupStep: React.FC<StaffSetupStepProps> = ({
  staffData,
  updateStaffData,
  onNext,
  onSkip,
  onBack,
  skipToCompletion
}) => {
  const [isAddingStaff, setIsAddingStaff] = useState(staffData.addStaff);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddStaff = () => {
    setIsAddingStaff(true);
    updateStaffData({ addStaff: true });
    setShowForm(true);
  };
  
  const handleSkipStaff = () => {
    setIsAddingStaff(false);
    updateStaffData({ addStaff: false });
    onSkip();
  };
  
  const handleStaffCreated = () => {
    setShowForm(false);
    updateStaffData({ 
      createdStaff: staffData.createdStaff + 1 
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Users className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Staff Management</h2>
      </div>
      
      <p className="text-muted-foreground">
        You can add staff members to your hotel now or skip and do it later from the dashboard.
      </p>
      
      {!isAddingStaff ? (
        <Card className="p-6 text-center space-y-4">
          <Users className="h-12 w-12 mx-auto text-primary opacity-80" />
          <h3 className="text-lg font-medium">Add Staff Members</h3>
          <p className="text-muted-foreground">
            Invite staff members to help manage your hotel's services and requests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={handleAddStaff} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Staff Now
            </Button>
            <Button variant="outline" onClick={handleSkipStaff}>
              Skip for Now
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground pt-2">
            You can always add and manage staff later from your dashboard.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {showForm ? (
            <AddStaffForm 
              onStaffAdded={handleStaffCreated} 
              onCancel={() => setShowForm(false)} 
            />
          ) : (
            <div>
              {staffData.createdStaff > 0 && (
                <StaffAddedCard 
                  count={staffData.createdStaff} 
                  onAddAnother={() => setShowForm(true)} 
                />
              )}
              
              {staffData.createdStaff === 0 && (
                <Card className="p-6 text-center">
                  <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Staff Member
                  </Button>
                </Card>
              )}
              
              <NavigationButtons 
                onBack={onBack}
                onNext={onNext}
                skipToCompletion={skipToCompletion}
                showSkip={true}
                showSkipAll={true}
                nextLabel="Continue"
                skipLabel="Skip"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffSetupStep;

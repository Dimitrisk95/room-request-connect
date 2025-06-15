
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import HotelSetupStep from "./HotelSetupStep";
import { SetupData } from "./types";
import { useState } from "react";
import { useSetupSteps } from "./hooks/useSetupSteps";
import { useHotelSetup } from "./hooks/useHotelSetup";

interface SimpleSetupWizardProps {
  debugMode?: boolean;
}

const defaultSetupData: SetupData = {
  hotel: {
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    hotelCode: "",
  },
  rooms: {
    addRooms: false,
    createdRooms: 0,
    roomsToAdd: [],
  },
  staff: {
    addStaff: false,
    createdStaff: 0,
    staffToAdd: [],
  },
};

const SimpleSetupWizard = ({ debugMode = false }: SimpleSetupWizardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState<SetupData>(defaultSetupData);
  const { isCreating, handleCreateHotel } = useHotelSetup();
  const { currentStep, steps, nextStep, prevStep } = useSetupSteps();

  const updateSetupData = (data: Partial<SetupData>) => {
    setSetupData((prev) => ({ ...prev, ...data }));
  };

  const updateHotelData = (data: Partial<typeof setupData.hotel>) => {
    updateSetupData({ hotel: { ...setupData.hotel, ...data } });
  };

  const handleComplete = async () => {
    await handleCreateHotel(setupData, debugMode);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {debugMode && (
        <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 font-medium">
            Debug Mode Enabled: Automatic redirects are disabled
          </p>
        </div>
      )}

      <Steps steps={steps} currentStep={currentStep} className="mb-8" />

      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <HotelSetupStep
              hotelData={setupData.hotel}
              updateHotelData={updateHotelData}
              onNext={nextStep}
              isLoading={false}
              hotelCreated={false}
            />
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Ready to Create Your Hotel!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your hotel information has been collected. Click below to
                  create your hotel and start managing your property.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Hotel Details</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Name:</strong> {setupData.hotel.name}
                  </li>
                  <li>
                    <strong>Code:</strong> {setupData.hotel.hotelCode}
                  </li>
                  {setupData.hotel.address && (
                    <li>
                      <strong>Address:</strong> {setupData.hotel.address}
                    </li>
                  )}
                  {setupData.hotel.contactEmail && (
                    <li>
                      <strong>Email:</strong>{" "}
                      {setupData.hotel.contactEmail}
                    </li>
                  )}
                  {setupData.hotel.contactPhone && (
                    <li>
                      <strong>Phone:</strong>{" "}
                      {setupData.hotel.contactPhone}
                    </li>
                  )}
                </ul>
                {setupData.rooms.addRooms &&
                  setupData.rooms.roomsToAdd.length > 0 && (
                    <div className="mt-2 text-left text-xs">
                      <span className="font-semibold">
                        Rooms to Add:
                      </span>{" "}
                      {setupData.rooms.roomsToAdd.length}
                    </div>
                  )}
                {setupData.staff.addStaff &&
                  setupData.staff.staffToAdd.length > 0 && (
                    <div className="mt-1 text-left text-xs">
                      <span className="font-semibold">
                        Staff to Add:
                      </span>{" "}
                      {setupData.staff.staffToAdd.length}
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleComplete}
                  disabled={isCreating || debugMode}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating
                    ? "Creating Hotel..."
                    : "Create Hotel & Continue"}
                </button>

                {debugMode && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 rounded-md font-medium"
                  >
                    Go to Dashboard (Debug)
                  </button>
                )}

                <button
                  onClick={prevStep}
                  disabled={isCreating}
                  className="w-full bg-muted text-muted-foreground hover:bg-muted/90 h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  Back to Edit Details
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSetupWizard;

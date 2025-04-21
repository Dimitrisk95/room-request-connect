
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RoomDetailsFooterProps {
  onCancel: () => void;
  onAction: () => void;
  actionDisabled: boolean;
  isReservationTab: boolean;
  isEditMode: boolean;
}

const RoomDetailsFooter = ({
  onCancel,
  onAction,
  actionDisabled,
  isReservationTab,
  isEditMode,
}: RoomDetailsFooterProps) => (
  <DialogFooter className="flex items-center justify-between mt-6">
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    {isReservationTab && (
      <Button 
        onClick={onAction}
        disabled={actionDisabled}
      >
        {isEditMode ? "Update Reservation" : "Create Reservation"}
      </Button>
    )}
  </DialogFooter>
);

export default RoomDetailsFooter;

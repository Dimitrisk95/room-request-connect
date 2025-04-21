
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface RoomDetailsFooterProps {
  onCancel: () => void;
  onAction: () => void;
  onDelete?: () => void;
  actionDisabled: boolean;
  isReservationTab: boolean;
  isEditMode: boolean;
}

const RoomDetailsFooter = ({
  onCancel,
  onAction,
  onDelete,
  actionDisabled,
  isReservationTab,
  isEditMode,
}: RoomDetailsFooterProps) => (
  <DialogFooter className="flex items-center justify-between mt-6">
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    {isReservationTab && (
      <div className="flex gap-2">
        {isEditMode && onDelete && (
          <Button variant="destructive" onClick={onDelete} type="button">
            <Trash className="h-4 w-4 mr-2" />
            Cancel Reservation
          </Button>
        )}
        <Button 
          onClick={onAction}
          disabled={actionDisabled}
        >
          {isEditMode ? "Update Reservation" : "Create Reservation"}
        </Button>
      </div>
    )}
  </DialogFooter>
);

export default RoomDetailsFooter;

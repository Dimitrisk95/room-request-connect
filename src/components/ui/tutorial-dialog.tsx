
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  title: string;
  description: string;
  content: React.ReactNode;
}

export const TutorialDialog: React.FC<TutorialDialogProps> = ({
  isOpen,
  onClose,
  onSkip,
  title,
  description,
  content,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {content}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip Tutorial
          </Button>
          <Button onClick={onClose}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ResetDatabaseButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('clean-hotel-data');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to reset database.",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "All hotel data cleared. You can now register again.",
      });
      
      // Clear local storage to remove any user data
      localStorage.clear();
      
      // Redirect to the login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Reset Database
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Database</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete ALL data from the hotel database, including users, rooms, and requests.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleReset();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Yes, Reset Everything"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

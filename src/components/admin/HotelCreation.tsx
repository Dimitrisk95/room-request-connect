
import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const HotelCreation = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [hotelName, setHotelName] = useState("");

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Create new hotel in the hotels table
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert([{ name: hotelName }])
        .select('id, name')
        .single();

      if (hotelError) {
        if (hotelError.code === '23505') {
          throw new Error('A hotel with this name already exists. Please choose a different name.');
        }
        throw hotelError;
      }

      if (!hotelData) {
        throw new Error('Failed to create hotel');
      }

      // Update the user's hotel_id
      const { error: updateError } = await supabase
        .from("users")
        .update({ hotel_id: hotelData.id })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      // Update local user state
      if (user) {
        const updatedUser = { ...user, hotelId: hotelData.id };
        updateUser(updatedUser);
      }

      toast({
        title: "Hotel created successfully",
        description: `${hotelName} has been created. You can now manage your hotel settings.`,
      });
      
      // Navigate to hotel settings
      navigate("/admin?tab=hotel-settings");
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      toast({
        title: "Failed to create hotel",
        description: error.message || "There was an error creating the hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Create New Hotel
        </CardTitle>
        <CardDescription>
          Set up a new hotel in the system to start managing rooms and staff
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCreateHotel}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input
                id="hotelName"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? (
              "Creating Hotel..."
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Hotel
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HotelCreation;


import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "../../types";

export const createRooms = async (setupData: SetupData, hotelId: string): Promise<void> => {
  if (!setupData.rooms.addRooms || !setupData.rooms.roomsToAdd || setupData.rooms.roomsToAdd.length === 0) {
    return;
  }

  console.log("[Hotel Setup] Adding rooms:", setupData.rooms.roomsToAdd.length);
  
  const rooms = setupData.rooms.roomsToAdd.map((room: any) => ({
    ...room,
    hotel_id: hotelId,
    status: room.status || "vacant",
    bed_type: room.bedType || "single",
    room_number: room.roomNumber,
    type: room.type || "standard",
    capacity: room.capacity || 2,
  }));

  const { error: roomsError } = await supabase
    .from("rooms")
    .insert(rooms);

  if (roomsError) {
    console.error("[Hotel Setup] Failed to add rooms:", roomsError);
    throw new Error("Failed to add rooms to the hotel");
  } else {
    console.log("[Hotel Setup] Rooms added successfully");
  }
};

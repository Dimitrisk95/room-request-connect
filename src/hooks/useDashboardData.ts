
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { fetchRequests, Request } from "@/context/requests/requestHandlers";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [occupiedRooms, setOccupiedRooms] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<number>(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState<number>(0);
  const [urgentRequests, setUrgentRequests] = useState<number>(0);

  const fetchDashboardData = async () => {
    try {
      if (!user?.hotelId) return;

      // Fetch rooms data
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('status')
        .eq('hotel_id', user.hotelId);

      if (roomsData) {
        setTotalRooms(roomsData.length);
        setOccupiedRooms(roomsData.filter(room => room.status === 'occupied').length);
      }

      // Fetch requests data
      const requests = await fetchRequests(user.hotelId);
      
      // Filter pending requests
      const pendingReqs = requests.filter(req => req.status === 'pending');
      setPendingRequests(pendingReqs);
      
      // Count urgent requests
      setUrgentRequests(requests.filter(req => 
        req.priority === 'urgent' && ['pending', 'in-progress'].includes(req.status)
      ).length);

      // Add more data fetching as needed for check-ins and check-outs
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user?.hotelId) {
      fetchDashboardData();
    }
  }, [user?.hotelId]);

  return {
    occupiedRooms,
    totalRooms,
    pendingRequests,
    urgentRequests,
    todayCheckIns,
    todayCheckOuts,
    fetchDashboardData,
  };
};

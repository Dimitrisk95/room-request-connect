
import DashboardShell from "@/components/ui/dashboard-shell";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const {
    occupiedRooms,
    totalRooms,
    pendingRequests,
    urgentRequests,
    todayCheckIns,
    todayCheckOuts,
  } = useDashboardData();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <DashboardHeader />
        
        <DashboardStats 
          occupiedRooms={occupiedRooms}
          totalRooms={totalRooms}
          pendingRequests={pendingRequests.length}
          urgentRequests={urgentRequests}
          todayCheckIns={todayCheckIns}
          todayCheckOuts={todayCheckOuts}
        />

        <DashboardContent 
          pendingRequests={pendingRequests}
          todayCheckIns={todayCheckIns}
          todayCheckOuts={todayCheckOuts}
        />
      </div>
    </DashboardShell>
  );
};

export default Dashboard;

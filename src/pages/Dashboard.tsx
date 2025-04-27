
import { Link } from "react-router-dom";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link to="/rooms">Manage Rooms</Link>
          </Button>
        </div>

        <DashboardStats 
          occupiedRooms={occupiedRooms}
          totalRooms={totalRooms}
          pendingRequests={pendingRequests.length}
          urgentRequests={urgentRequests}
          todayCheckIns={todayCheckIns}
          todayCheckOuts={todayCheckOuts}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentRequests pendingRequests={pendingRequests} />
          <TodaySchedule 
            todayCheckIns={todayCheckIns}
            todayCheckOuts={todayCheckOuts}
          />
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;

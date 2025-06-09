
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { Request } from "@/context/requests/requestHandlers";

interface DashboardContentProps {
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingRequests: Request[];
}

export const DashboardContent = ({ 
  todayCheckIns,
  todayCheckOuts,
  pendingRequests 
}: DashboardContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RecentRequests />
      <TodaySchedule 
        todayCheckIns={todayCheckIns}
        todayCheckOuts={todayCheckOuts}
      />
    </div>
  );
};


import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { Request } from "@/context/requests/requestHandlers";

interface DashboardContentProps {
  pendingRequests: Request[];
  todayCheckIns: number;
  todayCheckOuts: number;
}

export const DashboardContent = ({ 
  pendingRequests,
  todayCheckIns,
  todayCheckOuts 
}: DashboardContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RecentRequests pendingRequests={pendingRequests} />
      <TodaySchedule 
        todayCheckIns={todayCheckIns}
        todayCheckOuts={todayCheckOuts}
      />
    </div>
  );
};

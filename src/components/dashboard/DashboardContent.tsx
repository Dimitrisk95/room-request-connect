
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";

interface DashboardContentProps {
  todayCheckIns: number;
  todayCheckOuts: number;
}

export const DashboardContent = ({ 
  todayCheckIns,
  todayCheckOuts 
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

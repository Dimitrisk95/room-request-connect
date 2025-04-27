
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CheckCircle } from "lucide-react";

interface TodayScheduleProps {
  todayCheckIns: number;
  todayCheckOuts: number;
}

export const TodaySchedule = ({ todayCheckIns, todayCheckOuts }: TodayScheduleProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayCheckIns > 0 || todayCheckOuts > 0 ? (
            <>
              {Array.from({ length: Math.min(todayCheckIns, 3) }).map((_, index) => (
                <div key={`checkin-${index}`} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="bg-primary h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Check-in: Guest Name
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room Number • 2 guests
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/rooms">Prepare</Link>
                  </Button>
                </div>
              ))}
              {Array.from({ length: Math.min(todayCheckOuts, 2) }).map((_, index) => (
                <div key={`checkout-${index}`} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Check-out: Guest Name
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room Number • Departure
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/calendar">Process</Link>
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No check-ins or check-outs today
            </div>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/calendar">View Calendar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

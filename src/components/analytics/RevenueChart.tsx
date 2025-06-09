
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    occupancy: number;
  }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartConfig = {
    revenue: { label: "Revenue ($)" },
    occupancy: { label: "Occupancy (%)" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Occupancy Correlation</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="occupancy" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Occupancy (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

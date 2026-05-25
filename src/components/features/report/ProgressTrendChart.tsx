"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Sprint 18", actual: 400, target: 240 },
  { name: "Sprint 19", actual: 300, target: 139 },
  { name: "Sprint 20", actual: 200, target: 980 },
  { name: "Sprint 21", actual: 278, target: 390 },
  { name: "Sprint 22", actual: 189, target: 480 },
  { name: "Sprint 23", actual: 239, target: 380 },
  { name: "Sprint 24", actual: 349, target: 430 },
];

export const ProgressTrendChart = () => {
  return (
    <div className="h-52 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--muted-foreground))"
                stopOpacity={0.1}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--muted-foreground))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorTarget)"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorActual)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

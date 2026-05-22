import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface SprintVelocityChartProps {
  data: DataPoint[];
}

export const SprintVelocityChart: React.FC<SprintVelocityChartProps> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
      <YAxis stroke="var(--color-muted-foreground)" />
      <Tooltip />
      <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

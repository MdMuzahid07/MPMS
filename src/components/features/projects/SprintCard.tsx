import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

interface SprintCardProps {
  name: string;
  progress: number; // 0-100
  startDate: string; // ISO
  endDate: string; // ISO
}

export const SprintCard: React.FC<SprintCardProps> = ({
  name,
  progress,
  startDate,
  endDate,
}) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <Calendar className="text-muted-foreground size-5" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-2">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">
            {new Date(startDate).toLocaleDateString()} –{" "}
            {new Date(endDate).toLocaleDateString()}
          </p>
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {progress}% complete
        </p>
      </CardContent>
    </Card>
  );
};

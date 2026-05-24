"use client";

import { Card, CardContent } from "@/components/ui/card";

interface TeamStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export const TeamStatCard = ({
  title,
  value,
  description,
  icon,
}: TeamStatCardProps) => {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex h-36 flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase">
            {title}
          </p>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div>
          <p className="text-foreground text-[34px] leading-none font-semibold tracking-tight">
            {value}
          </p>
          <p className="text-muted-foreground mt-2 text-[11px]">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

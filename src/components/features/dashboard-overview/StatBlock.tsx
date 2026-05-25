"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

type StatCard = {
  title: string;
  value: string;
  tag: string;
  icon: React.ReactNode;
  tagTone: string;
};

interface StatBlockProps {
  item: StatCard;
}

export const StatBlock = ({ item }: StatBlockProps) => {
  return (
    <article className="border-border bg-card rounded-xl border p-4">
      <div className="mb-4 flex items-start justify-between">
        <span className="border-border bg-muted/35 text-muted-foreground inline-flex size-8 items-center justify-center rounded-md border">
          {item.icon}
        </span>
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded-sm border px-1.5 text-[10px]",
            item.tagTone,
          )}
        >
          {item.tag}
        </Badge>
      </div>
      <p className="text-muted-foreground text-[11px]">{item.title}</p>
      <p className="mt-1 text-3xl leading-none font-semibold tracking-tight">
        {item.value}
      </p>
    </article>
  );
};

export default StatBlock;

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
    <article className="group bg-card relative overflow-hidden rounded-2xl border p-5">
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-start justify-between">
        <span className="border-border/40 bg-background/50 text-foreground inline-flex size-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110">
          {item.icon}
        </span>
        <Badge
          variant="outline"
          className={cn(
            "h-6 rounded-full border px-2.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md",
            item.tagTone,
          )}
        >
          {item.tag}
        </Badge>
      </div>

      <div className="relative space-y-1.5">
        <p className="text-muted-foreground text-[12px] font-semibold tracking-wide uppercase">
          {item.title}
        </p>
        <p className="text-foreground text-4xl font-bold tracking-tight">
          {item.value}
        </p>
      </div>
    </article>
  );
};

export default StatBlock;

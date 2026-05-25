"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleAlert, Clock3, FileText, TrendingUp } from "lucide-react";
import React from "react";

type FocusTone = "warning" | "compliance" | "people";

type FocusItem = {
  title: string;
  description: string;
  badge: string;
  meta: string;
  tone: FocusTone;
};

const FOCUS_TONE_STYLES: Record<
  FocusTone,
  { icon: React.ReactNode; iconWrap: string }
> = {
  warning: {
    icon: <CircleAlert className="size-4" />,
    iconWrap: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  },
  compliance: {
    icon: <FileText className="size-4" />,
    iconWrap: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  },
  people: {
    icon: <TrendingUp className="size-4" />,
    iconWrap: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
};

interface FocusCardProps {
  item: FocusItem;
}

export const FocusCard = ({ item }: FocusCardProps) => {
  const toneStyles = FOCUS_TONE_STYLES[item.tone];

  return (
    <article className="border-border bg-card rounded-xl border p-3.5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md",
            toneStyles.iconWrap,
          )}
        >
          {toneStyles.icon}
        </span>
        <div>
          <h4 className="text-sm font-semibold">{item.title}</h4>
          <p className="text-muted-foreground mt-1 text-xs leading-5">
            {item.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 rounded-sm px-1.5 text-[10px]"
            >
              {item.badge}
            </Badge>
            {item.meta && (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                <Clock3 className="size-3" />
                {item.meta}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default FocusCard;

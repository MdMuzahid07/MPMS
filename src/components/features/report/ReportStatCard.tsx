"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tag } from "./report.types";

interface ReportStatCardProps {
  title: string;
  value: string;
  footer: string;
  tags?: Tag[];
}

export const ReportStatCard = ({
  title,
  value,
  footer,
  tags,
}: ReportStatCardProps) => {
  return (
    <article className="border-border bg-card rounded-md border p-4">
      <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase">
        {title}
      </p>
      <p className="mt-2 text-4xl leading-none font-semibold tracking-tight">
        {value}
      </p>
      <p className="text-muted-foreground mt-3 text-xs">{footer}</p>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag.text}
              variant="outline"
              className={cn(
                "h-5 rounded-sm border px-1.5 text-[10px]",
                tag.tone,
              )}
            >
              {tag.text}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
};

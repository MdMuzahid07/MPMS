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
    <article className="group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:border-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:border-[0_8px_30px_rgba(255,255,255,0.02)]">
      <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <p className="text-muted-foreground text-[11px] font-bold tracking-[0.15em] uppercase">
          {title}
        </p>
        <p className="text-foreground mt-3 text-5xl font-extrabold tracking-tight">
          {value}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <p className="text-muted-foreground text-xs font-medium">{footer}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.text}
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full border px-2.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md",
                    tag.tone,
                  )}
                >
                  {tag.text}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReportStatCard;

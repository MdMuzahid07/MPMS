"use client";

import { Funnel } from "lucide-react";
import FocusCard from "./FocusCard";

type FocusItem = {
  title: string;
  description: string;
  badge: string;
  meta: string;
  tone: "warning" | "compliance" | "people";
};

interface FocusSectionProps {
  items: FocusItem[];
}

export const FocusSection = ({ items }: FocusSectionProps) => {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">
          Management Focus
        </h3>
        <Funnel className="text-muted-foreground size-4" />
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <FocusCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FocusSection;

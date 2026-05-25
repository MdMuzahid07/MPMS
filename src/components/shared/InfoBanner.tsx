"use client";

import { Info } from "lucide-react";

interface InfoBannerProps {
  message?: string;
}

export const InfoBanner = ({
  message = "This page summarizes delivery health, pending work risk, and team execution quality for quick weekly review.",
}: InfoBannerProps) => {
  return (
    <section className="border-border/60 bg-primary/5 text-muted-foreground hover:border-primary/20 hover:bg-primary/10 mt-8 rounded-xl border p-4 text-[13px] backdrop-blur-sm transition-colors">
      <p className="flex items-start gap-2.5 leading-relaxed">
        <Info className="text-primary mt-0.5 size-4 shrink-0" />
        {message}
      </p>
    </section>
  );
};

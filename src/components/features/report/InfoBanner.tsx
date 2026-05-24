"use client";

import { Info } from "lucide-react";

interface InfoBannerProps {
  message?: string;
}

export const InfoBanner = ({
  message = "This page summarizes delivery health, pending work risk, and team execution quality for quick weekly review.",
}: InfoBannerProps) => {
  return (
    <section className="border-border bg-card text-muted-foreground rounded-md border p-3 text-xs">
      <p className="inline-flex items-center gap-1.5">
        <Info className="size-3.5" />
        {message}
      </p>
    </section>
  );
};

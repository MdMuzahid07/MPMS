"use client";

import OnyxLogo from "@/components/shared/OnyxLogo";
import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Glassmorphic premium ambient background glow spheres */}
      <div className="bg-primary/8 pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[100px] duration-6000" />
      <div className="bg-primary/8 pointer-events-none absolute right-1/4 bottom-1/4 h-125 w-125 translate-x-1/2 translate-y-1/2 animate-pulse rounded-full blur-[120px] duration-8000" />

      {/* Main Container */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 flex max-w-sm flex-col items-center gap-6 px-6 text-center duration-500">
        {/* Logo container with delicate shadow glow */}
        <div className="group relative">
          {/* Subtle soft backdrop glow for the logo */}
          <div className="bg-primary/10 group-hover:bg-primary/20 absolute inset-0 scale-125 rounded-full opacity-60 blur-3xl transition-all duration-700" />

          <div className="relative animate-pulse duration-2500">
            <OnyxLogo className="h-20 w-auto" />
          </div>
        </div>

        {/* Loading Progress Section */}
        <div className="w-full max-w-50 space-y-3 pt-4">
          {/* Micro-loading linear track */}
          <div className="bg-muted border-border/10 relative h-1 w-full overflow-hidden rounded-full border">
            {/* Glowing moving strip indicator */}
            <div
              className="from-primary/40 via-primary to-primary/40 absolute top-0 left-0 h-full w-1/3 rounded-full bg-linear-to-r"
              style={{
                animation: "loadingSlide 1.6s infinite ease-in-out",
              }}
            />
          </div>

          {/* Subtext info */}
          <p className="text-muted-foreground min-h-6 text-[10px] font-bold tracking-[0.18em] uppercase select-none">
            Loading{dots}
          </p>
        </div>
      </div>

      {/* Embedded CSS animation to be perfectly robust & compile safely anywhere */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loadingSlide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%) scaleX(1.4);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `,
        }}
      />
    </div>
  );
}

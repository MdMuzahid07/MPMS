import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedView() {
  return (
    <div className="bg-background animate-in fade-in flex min-h-screen flex-col items-center justify-center p-6 text-center duration-300 select-none">
      {/* Sleek, Minimal Container */}
      <div className="border-border/60 bg-card/50 flex w-full max-w-sm flex-col items-center justify-center space-y-6 rounded-xl border p-8 backdrop-blur-sm">
        {/* Sleek Indicator Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 px-2.5 py-0.5 text-xs font-semibold text-rose-500">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>403 Restricted</span>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-foreground text-xl font-bold tracking-tight">
            Access Restricted
          </h1>
          <p className="text-muted-foreground mx-auto max-w-[280px] text-xs leading-relaxed">
            You do not have the required administrative credentials to view this
            page. Please return to your active workspace.
          </p>
        </div>

        {/* Action Button */}
        <Button
          asChild
          variant="outline"
          className="border-border/80 hover:bg-muted/50 hover:text-foreground h-10 w-full gap-2 rounded-lg border text-xs font-semibold transition-all"
        >
          <Link href="/my-tasks">
            <ArrowLeft className="h-3.5 w-3.5" />
            Go to My Tasks
          </Link>
        </Button>
      </div>
    </div>
  );
}

import OnyxLogo from "../../../shared/OnyxLogo";

export function DashboardLoading() {
  return (
    <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative mb-6">
        <div className="border-primary/20 border-t-primary h-16 w-16 animate-spin rounded-full border-4" />
        <OnyxLogo />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium">
        Initializing secure workspace...
      </p>
    </div>
  );
}

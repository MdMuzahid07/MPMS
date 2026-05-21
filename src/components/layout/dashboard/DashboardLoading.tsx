import Image from "next/image";

export function DashboardLoading() {
  return (
    <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative mb-6">
        <div className="border-primary/20 border-t-primary h-16 w-16 animate-spin rounded-full border-4" />
        <Image
          src="/images/mpms-logo.png"
          alt="MPMS Logo"
          width={32}
          height={32}
          className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium">
        Initializing secure workspace...
      </p>
    </div>
  );
}

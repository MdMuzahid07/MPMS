import type { User } from "@/redux/feature/auth/authSlice";
import { Lock } from "lucide-react";
import Link from "next/link";

type DashboardAccessRestrictedProps = {
  role: User["role"];
};

export function DashboardAccessRestricted({
  role,
}: DashboardAccessRestrictedProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md flex-col items-center justify-center text-center">
      <div className="bg-destructive/10 text-destructive mb-5 flex size-14 items-center justify-center rounded-full">
        <Lock className="size-7" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        Your active role{" "}
        <span className="text-primary font-semibold uppercase">{role}</span>{" "}
        cannot manage administrative workspace areas.
      </p>
      <Link
        href="/my-tasks"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition"
      >
        Return to My Tasks
      </Link>
    </div>
  );
}

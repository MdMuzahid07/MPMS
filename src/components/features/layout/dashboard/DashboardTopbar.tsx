"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import type { User } from "@/redux/feature/auth/authSlice";
import { Command, Plus, Search } from "lucide-react";
import Link from "next/link";
import { isAdminRole } from "./dashboard-layout.config";

type DashboardTopbarProps = {
  pathname: string;
  pageTitle: string;
  pageHeading: string;
  user: User | null;
  onLogout: () => void;
};

export function DashboardTopbar({
  pathname,
  pageTitle,
  pageHeading,
  user,
}: DashboardTopbarProps) {
  const { isMobile } = useSidebar();
  const isAdmin = isAdminRole(user?.role);
  const isTeamRoute = pathname.startsWith("/team");

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/85 sticky top-0 z-20 flex h-17 shrink-0 items-center justify-between px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        {isMobile ? (
          <SidebarTrigger className="text-muted-foreground hover:bg-muted size-8 rounded-md" />
        ) : null}
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-[11px] font-medium tracking-wide">
            {pageTitle}
          </p>
          <h1 className="text-foreground truncate text-base font-semibold tracking-tight">
            {pageHeading}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!isTeamRoute && (
          <label className="relative hidden w-65 md:block lg:w-90">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search tasks, projects..."
              className="border-input bg-background focus:border-ring focus:ring-ring/15 h-9 w-full rounded-md border pr-8 pl-8 text-xs transition outline-none focus:ring-2"
            />
            <Command className="text-muted-foreground/70 absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
          </label>
        )}

        {isAdmin && !isTeamRoute && (
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hidden h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition sm:flex"
          >
            <Plus className="size-3.5" />
            <span>New Project</span>
          </Link>
        )}
      </div>
    </header>
  );
}

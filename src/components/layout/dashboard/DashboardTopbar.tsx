"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import type { User } from "@/redux/feature/auth/authSlice";
import { Command, LogOut, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getUserInitials, isAdminRole } from "./dashboard-layout.config";

type DashboardTopbarProps = {
  pageTitle: string;
  user: User | null;
  onLogout: () => void;
};

export function DashboardTopbar({
  pageTitle,
  user,
  onLogout,
}: DashboardTopbarProps) {
  const { isMobile } = useSidebar();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const initials = getUserInitials(user?.name);
  const isAdmin = isAdminRole(user?.role);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/85 sticky top-0 z-20 flex h-17 shrink-0 items-center justify-between px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        {isMobile ? (
          <SidebarTrigger className="text-muted-foreground hover:bg-muted size-8 rounded-md" />
        ) : null}
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-[11px] font-medium">
            {pageTitle}
          </p>
          <h1 className="text-foreground truncate text-base font-semibold tracking-tight">
            {user?.role === "member"
              ? "Personal Workspace"
              : "Operations Workspace"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden w-65 md:block lg:w-90">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search tasks, projects..."
            className="border-input bg-background focus:border-ring focus:ring-ring/15 h-9 w-full rounded-md border pr-8 pl-8 text-xs transition outline-none focus:ring-2"
          />
          <Command className="text-muted-foreground/70 absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
        </label>

        {isAdmin && (
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hidden h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition sm:flex"
          >
            <Plus className="size-3.5" />
            <span>New Project</span>
          </Link>
        )}

        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((open) => !open)}
              className="hover:bg-muted flex items-center gap-2 rounded-full p-0.5 transition"
            >
              <div className="border-border bg-background flex size-8 items-center justify-center rounded-full border text-xs font-semibold">
                {initials}
              </div>
            </button>

            {profileDropdownOpen && (
              <>
                <button
                  className="fixed inset-0 z-20 cursor-default"
                  aria-label="Close profile menu"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="border-border bg-popover text-popover-foreground absolute right-0 z-30 mt-2 w-56 rounded-md border p-1.5 shadow-lg">
                  <div className="border-border border-b px-3 py-2">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-destructive hover:bg-destructive/10 mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition"
                  >
                    <LogOut className="size-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

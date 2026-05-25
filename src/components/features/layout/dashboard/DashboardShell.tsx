"use client";

import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/redux/feature/auth/authSlice";
import React, { useEffect } from "react";
import { DashboardAccessRestricted } from "./DashboardAccessRestricted";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { getDashboardPageDetails } from "./dashboard-layout.config";

type DashboardShellProps = {
  children: React.ReactNode;
  isUnauthorized: boolean;
  onLogout: () => void;
  pathname: string;
  user: User | null;
};

function SidebarRouteWatcher({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return null;
}

export function DashboardShell({
  children,
  isUnauthorized,
  onLogout,
  pathname,
  user,
}: DashboardShellProps) {
  const { label: pageTitle, heading: pageHeading } = getDashboardPageDetails(
    pathname,
    user?.role,
  );

  return (
    <SidebarProvider
      defaultOpen
      className="text-foreground dark:bg-background min-h-dvh bg-[#f4f7fb] antialiased"
    >
      <DashboardSidebar onLogout={onLogout} pathname={pathname} user={user} />

      <SidebarInset className="dark:bg-background min-h-dvh min-w-0 bg-[#f4f7fb]">
        <DashboardTopbar
          onLogout={onLogout}
          pathname={pathname}
          pageTitle={pageTitle}
          pageHeading={pageHeading}
          user={user}
        />

        <main className="border-border/50 flex-1 overflow-y-auto border-t px-4 py-5 md:px-6 lg:px-8">
          {isUnauthorized && user ? (
            <DashboardAccessRestricted role={user.role} />
          ) : (
            <div className="container mx-auto w-full">{children}</div>
          )}
        </main>
      </SidebarInset>

      <SidebarRouteWatcher pathname={pathname} />
    </SidebarProvider>
  );
}

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SettingsIcon } from "@/components/ui/settings";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SunMoonIcon } from "@/components/ui/sun-moon";
import type { User } from "@/redux/feature/auth/authSlice";
import { useGetProjectsQuery } from "@/redux/feature/projects/projectsApi";
import {
  ArrowRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState } from "react";
import OnyxLogo from "../../../shared/OnyxLogo";
import {
  type AnimatedIconHandle,
  type DashboardNavItem,
  getDashboardNavItems,
  getUserInitials,
  isActiveNavItem,
  isAdminRole,
} from "./dashboard-layout.config";

const PROJECT_COLORS = [
  "bg-blue-500/75 text-white",
  "bg-emerald-500/75 text-white",
  "bg-amber-500/80 text-black",
  "bg-rose-500/75 text-white",
  "bg-purple-500/75 text-white",
];

function getProjectInitials(title: string) {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type DashboardSidebarProps = {
  user: User | null;
  pathname: string;
  onLogout: () => void;
};

type SidebarNavItemProps = {
  item: DashboardNavItem;
  isActive: boolean;
};

function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const Icon = item.icon;

  return (
    <SidebarMenuItem
      key={item.name}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.name}
        className="hover:bg-sidebar-accent hover:text-sidebar-foreground active:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary h-10 rounded-md px-3 text-[14px] font-medium data-[active=true]:border-none"
      >
        <Link href={item.href}>
          <span className="flex size-5 shrink-0 items-center justify-center">
            <Icon ref={iconRef} size={18} className="size-5" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">
            {item.name}
          </span>
        </Link>
      </SidebarMenuButton>
      {isActive && (
        <span className="bg-sidebar-primary absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-r-full" />
      )}
    </SidebarMenuItem>
  );
}

export function DashboardSidebar({
  user,
  pathname,
  onLogout,
}: DashboardSidebarProps) {
  const { isMobile, open, setOpen } = useSidebar();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activeTheme = resolvedTheme ?? theme;
  const navItems = getDashboardNavItems(user?.role);
  const initials = getUserInitials(user?.name);
  const themeIconRef = useRef<AnimatedIconHandle>(null);
  const settingsIconRef = useRef<AnimatedIconHandle>(null);
  const [isPinnedOpen, setIsPinnedOpen] = useState(true);

  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const isAdmin = isAdminRole(user?.role);
  const projectBaseRoute = isAdmin ? "/projects" : "/my-projects";
  const displayProjects = projects?.slice(0, 5) || [];

  const handleSidebarMouseEnter = () => {
    if (isMobile || open) {
      return;
    }
    setOpen(true);
  };

  const handleSidebarMouseLeave = () => {
    if (isMobile || isPinnedOpen) {
      return;
    }
    setOpen(false);
  };

  const handlePinToggle = () => {
    setIsPinnedOpen((prev) => {
      const next = !prev;
      setOpen(next);
      return next;
    });
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-sidebar-border bg-sidebar text-sidebar-foreground h-dvh min-h-dvh border-r"
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
    >
      <SidebarHeader className="border-sidebar-border-b px-3 pt-3 pb-2 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex h-12 items-center justify-between rounded-md px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <OnyxLogo className="size-32" />
              <button
                type="button"
                onClick={handlePinToggle}
                className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground inline-flex size-7 items-center justify-center rounded-md group-data-[collapsible=icon]:hidden"
                aria-label={
                  isPinnedOpen ? "Collapse sidebar" : "Pin sidebar open"
                }
              >
                {isPinnedOpen ? (
                  <PanelLeftClose className="size-4" />
                ) : (
                  <PanelLeftOpen className="size-4" />
                )}
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-2">
        <div className="text-sidebar-foreground/45 mb-2 px-2 text-[10px] font-semibold tracking-[0.16em] uppercase group-data-[collapsible=icon]:hidden">
          Main
        </div>
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item.href, pathname);
            return (
              <SidebarNavItem isActive={isActive} item={item} key={item.name} />
            );
          })}
        </SidebarMenu>

        <div className="mt-5 mb-2 flex items-center justify-between px-2 group-data-[collapsible=icon]:hidden">
          <span className="text-sidebar-foreground/45 text-[10px] font-semibold tracking-[0.16em] uppercase">
            Projects
          </span>
          {isAdmin && (
            <Link href="/projects/new">
              <Plus className="text-sidebar-foreground/55 hover:text-sidebar-foreground size-3.5 cursor-pointer transition-colors" />
            </Link>
          )}
        </div>

        <div className="space-y-1 px-1 group-data-[collapsible=icon]:hidden">
          {isProjectsLoading ? (
            <div className="space-y-2 px-2 py-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex h-9 items-center gap-2">
                  <div className="bg-sidebar-accent size-5 animate-pulse rounded-full" />
                  <div className="bg-sidebar-accent h-3 w-24 animate-pulse rounded-md" />
                </div>
              ))}
            </div>
          ) : displayProjects.length > 0 ? (
            displayProjects.map((project, idx) => {
              const colorClass = PROJECT_COLORS[idx % PROJECT_COLORS.length];
              const isActive = pathname.startsWith(
                `${projectBaseRoute}/${project._id}`,
              );

              return (
                <Link
                  key={project._id}
                  href={`${projectBaseRoute}/${project._id}`}
                  className={`flex h-9 w-full items-center gap-2 rounded-md px-2 text-left transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "hover:bg-sidebar-accent"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${colorClass}`}
                  >
                    {getProjectInitials(project.title)}
                  </span>
                  <span className="flex-1 truncate text-[13px]">
                    {project.title}
                  </span>
                  {isActive && (
                    <Pin className="text-sidebar-foreground/55 size-3.5" />
                  )}
                </Link>
              );
            })
          ) : (
            <div className="text-sidebar-foreground/50 px-2 py-2 text-xs">
              No active projects
            </div>
          )}

          <Link
            href={projectBaseRoute}
            className="hover:bg-sidebar-accent text-sidebar-foreground/80 mt-1 flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-[13px] font-medium transition-colors"
          >
            <span>View all projects</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 pb-3 group-data-[collapsible=icon]:px-2">
        <div className="bg-sidebar-border mb-2 h-px" />
        <SidebarMenu className="gap-1">
          <SidebarMenuItem
            onMouseEnter={() => settingsIconRef.current?.startAnimation()}
            onMouseLeave={() => settingsIconRef.current?.stopAnimation()}
          >
            <SidebarMenuButton
              tooltip="Settings"
              className="text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-foreground active:bg-sidebar-accent h-9 rounded-md px-2 text-xs font-medium"
            >
              <span className="flex size-5 shrink-0 items-center justify-center">
                <SettingsIcon
                  ref={settingsIconRef}
                  size={18}
                  className="size-5"
                />
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem
            onMouseEnter={() => themeIconRef.current?.startAnimation()}
            onMouseLeave={() => themeIconRef.current?.stopAnimation()}
          >
            <SidebarMenuButton
              tooltip={
                activeTheme === "dark" ? "Use light theme" : "Use dark theme"
              }
              className="text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-foreground active:bg-sidebar-accent h-9 rounded-md px-2 text-xs font-medium"
              onClick={() =>
                setTheme(activeTheme === "dark" ? "light" : "dark")
              }
            >
              <span className="flex size-5 shrink-0 items-center justify-center">
                <SunMoonIcon ref={themeIconRef} size={18} className="size-5" />
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                Theme
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {user && (
          <>
            <div className="bg-sidebar-border my-3 h-px" />
            <div className="rounded-md p-2 group-data-[collapsible=icon]:p-0">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <div className="border-sidebar-border bg-background flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                  {initials}
                </div>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-xs font-semibold">{user.name}</p>
                  <p className="text-sidebar-foreground/65 truncate text-[12px]">
                    {user.email}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground ml-3 rounded-md p-1.5 transition-colors group-data-[collapsible=icon]:hidden"
                      aria-label="Sign out"
                    >
                      <LogOut className="size-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign out of Onyx?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will end your current session. You will need to log
                        in again to access your projects and tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sign out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

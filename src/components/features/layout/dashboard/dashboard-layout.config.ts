import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { CheckCheckIcon } from "@/components/ui/check-check";
import { FolderKanbanIcon } from "@/components/ui/folder-kanban";
import { LayoutPanelTopIcon } from "@/components/ui/layout-panel-top";
import { UsersIcon } from "@/components/ui/users";
import type { User } from "@/redux/feature/auth/authSlice";
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";

export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

export type AnimatedIconComponent = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & {
    size?: number;
  } & RefAttributes<AnimatedIconHandle>
>;

export type DashboardNavItem = {
  name: string;
  href: string;
  icon: AnimatedIconComponent;
};

const adminNavItems: DashboardNavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutPanelTopIcon },
  { name: "Projects", href: "/projects", icon: FolderKanbanIcon },
  { name: "Tasks", href: "/tasks", icon: CheckCheckIcon },
  { name: "Team", href: "/team", icon: UsersIcon },
  { name: "Reports", href: "/reports", icon: ChartColumnIncreasingIcon },
];

const memberNavItems: DashboardNavItem[] = [
  { name: "My Tasks", href: "/my-tasks", icon: CheckCheckIcon },
  { name: "My Projects", href: "/my-projects", icon: FolderKanbanIcon },
];

const routeTitles = [
  { match: "/projects/new", label: "Projects / New" },
  { match: "/projects", label: "Projects / Overview" },
  { match: "/tasks", label: "Tasks / All Items" },
  { match: "/team", label: "Team Management" },
  { match: "/reports", label: "Reports / Overview" },
  { match: "/my-tasks", label: "Dashboard / My Tasks" },
  { match: "/my-projects", label: "Projects / My Workspaces" },
  { match: "/", label: "Dashboard / Overview" },
];

export function isAdminRole(role?: User["role"]) {
  return role === "admin" || role === "manager";
}

export function getDashboardNavItems(role?: User["role"]) {
  return isAdminRole(role) ? adminNavItems : memberNavItems;
}

export function getDashboardPageTitle(pathname: string) {
  return (
    routeTitles.find((route) => pathname.startsWith(route.match))?.label ??
    "Workspace"
  );
}

export function isAdministrativePath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/reports")
  );
}

export function isActiveNavItem(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "/";
  }

  return pathname.startsWith(href);
}

export function getUserInitials(name?: string) {
  return name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

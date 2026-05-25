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

export function isAdminRole(role?: User["role"]) {
  return role === "admin" || role === "manager";
}

export function getDashboardNavItems(role?: User["role"]) {
  return isAdminRole(role) ? adminNavItems : memberNavItems;
}

export function getDashboardPageDetails(pathname: string, role?: User["role"]) {
  const isMember = role === "member";

  // Exact or regex-based matches for comprehensive routing
  if (pathname.match(/^\/projects\/new/))
    return { label: "Projects / New", heading: "Create New Project" };
  if (pathname.match(/^\/projects\/[a-zA-Z0-9_-]+\/sprints\/[a-zA-Z0-9_-]+/))
    return { label: "Projects / Sprints", heading: "Sprint Details" };
  if (pathname.match(/^\/projects\/[a-zA-Z0-9_-]+\/sprints/))
    return { label: "Projects / Sprints", heading: "Sprints Overview" };
  if (pathname.match(/^\/projects\/[a-zA-Z0-9_-]+/))
    return { label: "Projects / Details", heading: "Project Dashboard" };
  if (pathname.match(/^\/projects/))
    return { label: "Projects / Overview", heading: "Project Management" };

  if (pathname.match(/^\/tasks/))
    return { label: "Tasks / All Items", heading: "Global Task Board" };
  if (pathname.match(/^\/team/))
    return { label: "Team / Directory", heading: "Team Management" };
  if (pathname.match(/^\/reports/))
    return { label: "Reports / Overview", heading: "Analytics & Reports" };

  if (pathname.match(/^\/my-tasks/))
    return { label: "Dashboard / My Tasks", heading: "My Assignments" };
  if (pathname.match(/^\/my-projects\/[a-zA-Z0-9_-]+\/sprints\/[a-zA-Z0-9_-]+/))
    return { label: "My Projects / Sprint", heading: "Active Sprint" };
  if (pathname.match(/^\/my-projects\/[a-zA-Z0-9_-]+/))
    return { label: "My Projects / Details", heading: "Workspace Details" };
  if (pathname.match(/^\/my-projects/))
    return { label: "Projects / My Workspaces", heading: "My Projects" };

  if (pathname === "/") {
    return {
      label: "Dashboard / Overview",
      heading: isMember ? "Personal Workspace" : "Operations Workspace",
    };
  }

  return { label: "Workspace", heading: "Overview" };
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

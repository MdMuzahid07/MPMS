import {
  Project,
  Sprint,
  Task,
  Comment,
  ActivityLog,
  TaskStatus,
} from "@/types/domain";

// ─── Initial Database Seeds with User-Friendly Names ────────────────

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Financial Operations Portal",
    client: "Acme Corp",
    description:
      "Enterprise workflow platform for standardizing financial transaction flows, billing validations, and customer account administration.",
    status: "Active",
    progress: 72,
    icon: "Briefcase",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    progressColor: "bg-primary",
    team: [
      { id: "u-1", name: "Alex Rivers", initials: "AR" },
      { id: "u-2", name: "Sarah Chen", initials: "SC" },
    ],
  },
  {
    id: "2",
    name: "Customer Experience Portal",
    client: "Starlight Inc",
    description:
      "Modern interface dashboard built for organizing user requests, resolving feedback, and streamlining customer onboarding workflows.",
    status: "On Hold",
    progress: 45,
    icon: "Briefcase",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    progressColor: "bg-amber-500",
    team: [
      { id: "u-1", name: "Alex Rivers", initials: "AR" },
      { id: "u-3", name: "Marcus Vance", initials: "MV" },
    ],
  },
  {
    id: "3",
    name: "Security Audit Framework",
    client: "Cyberdyne",
    description:
      "Automated system built for validating compliance rules, evaluating account permissions, and tracking access audit logs across folders.",
    status: "Active",
    progress: 89,
    icon: "Briefcase",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    progressColor: "bg-emerald-500",
    team: [
      { id: "u-2", name: "Sarah Chen", initials: "SC" },
      { id: "u-3", name: "Marcus Vance", initials: "MV" },
    ],
  },
];

const INITIAL_SPRINTS: Record<string, Sprint[]> = {
  "1": [
    {
      id: "sprint-4",
      title: "Sprint 04: Component Design & Polish",
      dateRange: "Sept 12 - Sept 26",
      status: "Active",
      progress: 82,
      team: ["/profile/picture/3", "/profile/picture/4"],
    },
    {
      id: "sprint-3",
      title: "Sprint 03: Feature Flow Validation",
      dateRange: "Aug 28 - Sept 11",
      status: "Completed",
      progress: 100,
      team: ["/profile/picture/5"],
    },
    {
      id: "sprint-5",
      title: "Sprint 05: Data Integrations & Testing",
      dateRange: "Sept 27 - Oct 11",
      status: "Upcoming",
      progress: 0,
      team: [],
    },
  ],
  "2": [
    {
      id: "sprint-2-1",
      title: "Sprint 01: Initial Layout Blueprint",
      dateRange: "Aug 01 - Aug 15",
      status: "Completed",
      progress: 100,
      team: ["/profile/picture/3"],
    },
  ],
  "3": [
    {
      id: "sprint-3-1",
      title: "Sprint 01: Audit Framework Prototypes",
      dateRange: "Aug 15 - Aug 30",
      status: "Completed",
      progress: 100,
      team: ["/profile/picture/4"],
    },
  ],
};

const INITIAL_TASKS: Record<string, Task[]> = {
  "sprint-4": [
    {
      id: "task-1",
      title: "Optimize Platform Page Load Times",
      priority: "High",
      estimate: "12 Effort Points",
      status: "In Progress",
      description:
        "Improve page responsiveness across the platform to ensure layout transitions load quickly when navigating between dashboard tabs.\n\nTarget Objectives:\n- Cache user settings on client launch to prevent duplicate network calls.\n- Compress main illustration assets to reduce bandwidth on mobile devices.\n- Audit and simplify complex data loops to prevent scroll lags.",
      attachments: [
        "layout_flowchart_v1.png",
        "product_spec_doc.pdf",
        "icon_assets.zip",
      ],
      commentsCount: 1,
      comments: [
        {
          id: "c-1",
          author: "Alex Rivers",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
          timestamp: "2 hours ago",
          content:
            "I've started auditing the main landing screens. Most of the layout latency seems to come from duplicate requests triggered on user settings loading.",
          likes: 3,
          hasLiked: false,
        },
      ],
    },
    {
      id: "task-2",
      title: "Update Platform Integration Guides",
      priority: "Medium",
      estimate: "4 hours",
      status: "Review",
      description:
        "Ensure all onboarding instructions, setup guides, and quick-start manuals are up to date for new platform developers.",
      commentsCount: 0,
      comments: [],
    },
    {
      id: "task-3",
      title: "Improve Dashboard Feed Performance",
      priority: "High",
      estimate: "6 hours",
      status: "To Do",
      description:
        "Refactor dashboard feed loading to display updates in real time. Avoid screen lockups when loading large activity logs on single page layouts.",
      commentsCount: 0,
      comments: [],
    },
    {
      id: "task-4",
      title: "Enhance Platform Security Audit Logs",
      priority: "Low",
      estimate: "2 hours",
      status: "Done",
      description:
        "Standardized layout logging format to ensure account admins receive detailed security details for all permission changes.",
      commentsCount: 0,
      comments: [],
    },
  ],
};

const INITIAL_ACTIVITY_LOGS: Record<string, ActivityLog[]> = {
  "task-1": [
    {
      id: "log-1",
      user: "Alex Rivers",
      action: "changed status to In Progress",
      timestamp: "10 minutes ago",
    },
    {
      id: "log-2",
      user: "Sarah Chen",
      action: "updated the task description",
      timestamp: "2 hours ago",
    },
    {
      id: "log-3",
      user: "System",
      action: "added attachment benchmark_v1.json",
      timestamp: "4 hours ago",
    },
  ],
};

// ─── Module Level In-Memory Database State ─────────────────────────────

const dbProjects = [...INITIAL_PROJECTS];
const dbSprints = { ...INITIAL_SPRINTS };
const dbTasks = { ...INITIAL_TASKS };
const dbActivityLogs = { ...INITIAL_ACTIVITY_LOGS };

// ─── Database Operations API ──────────────────────────────────────────

export const mockData = {
  getProjects: (): Project[] => {
    return dbProjects;
  },

  getProjectById: (id: string): Project | undefined => {
    return dbProjects.find((p) => p.id === id);
  },

  getSprintsByProject: (projectId: string): Sprint[] => {
    return dbSprints[projectId] || [];
  },

  getSprintById: (projectId: string, sprintId: string): Sprint | undefined => {
    const list = dbSprints[projectId] || [];
    return list.find((s) => s.id === sprintId);
  },

  getTasksBySprint: (sprintId: string): Task[] => {
    return dbTasks[sprintId] || [];
  },

  getTaskById: (sprintId: string, taskId: string): Task | undefined => {
    const list = dbTasks[sprintId] || [];
    return list.find((t) => t.id === taskId);
  },

  updateTaskStatus: (
    sprintId: string,
    taskId: string,
    newStatus: TaskStatus,
  ): boolean => {
    const list = dbTasks[sprintId];
    if (!list) return false;

    const taskIndex = list.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return false;

    const task = list[taskIndex];
    if (!task) return false;

    // Update status
    const oldStatus = task.status;
    list[taskIndex] = {
      ...task,
      status: newStatus,
    };
    dbTasks[sprintId] = [...list];

    // Append to Activity Logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: "Md Muzahid",
      action: `changed status from ${oldStatus} to ${newStatus}`,
      timestamp: "Just now",
    };
    const logs = dbActivityLogs[taskId] || [];
    dbActivityLogs[taskId] = [newLog, ...logs];

    return true;
  },

  addCommentToTask: (
    sprintId: string,
    taskId: string,
    content: string,
  ): Comment | undefined => {
    const list = dbTasks[sprintId];
    if (!list) return undefined;

    const taskIndex = list.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return undefined;

    const task = list[taskIndex];
    if (!task) return undefined;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "Md Muzahid",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
      timestamp: "Just now",
      content,
      likes: 0,
      hasLiked: false,
    };

    const updatedComments = [...(task.comments || []), newComment];
    list[taskIndex] = {
      ...task,
      comments: updatedComments,
      commentsCount: updatedComments.length,
    };
    dbTasks[sprintId] = [...list];

    // Append to Activity Logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: "Md Muzahid",
      action: "added a comment",
      timestamp: "Just now",
    };
    const logs = dbActivityLogs[taskId] || [];
    dbActivityLogs[taskId] = [newLog, ...logs];

    return newComment;
  },

  likeCommentInTask: (
    sprintId: string,
    taskId: string,
    commentId: string,
  ): boolean => {
    const list = dbTasks[sprintId];
    if (!list) return false;

    const taskIndex = list.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return false;

    const task = list[taskIndex];
    if (!task || !task.comments) return false;

    task.comments = task.comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
          hasLiked: !c.hasLiked,
        };
      }
      return c;
    });

    dbTasks[sprintId] = [...list];
    return true;
  },

  getActivityLogs: (taskId: string): ActivityLog[] => {
    return dbActivityLogs[taskId] || [];
  },
};

import {
  Folder,
  CheckSquare,
  Settings,
  Users,
  BarChart,
  FileText,
  Calendar,
  Layers,
  Inbox,
  AlertCircle,
} from "lucide-react";

const IconRegistry = [
  { name: "Folder", icon: Folder, category: "Project" },
  { name: "CheckSquare", icon: CheckSquare, category: "Task" },
  { name: "Settings", icon: Settings, category: "General" },
  { name: "Users", icon: Users, category: "Team" },
  { name: "BarChart", icon: BarChart, category: "Analytics" },
  { name: "FileText", icon: FileText, category: "Document" },
  { name: "Calendar", icon: Calendar, category: "Schedules" },
  { name: "Layers", icon: Layers, category: "Project" },
  { name: "Inbox", icon: Inbox, category: "General" },
  { name: "AlertCircle", icon: AlertCircle, category: "General" },
];

export default IconRegistry;

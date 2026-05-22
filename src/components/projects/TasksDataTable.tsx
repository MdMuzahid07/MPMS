import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

// Mock task data type
export type Task = {
  id: string;
  title: string;
  assignee: { id: string; initials: string; imageUrl?: string };
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
  dueDate: string; // ISO
};

const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design UI mockups",
    assignee: { id: "1", initials: "JD" },
    priority: "High",
    status: "In Progress",
    dueDate: "2023-11-05",
  },
  {
    id: "t2",
    title: "Implement API endpoints",
    assignee: { id: "2", initials: "AK" },
    priority: "Medium",
    status: "Todo",
    dueDate: "2023-11-10",
  },
  {
    id: "t3",
    title: "Write unit tests",
    assignee: { id: "3", initials: "SA" },
    priority: "Low",
    status: "Done",
    dueDate: "2023-11-01",
  },
];

export function TasksDataTable() {
  return (
    <Table>
      <TableCaption>Tasks for the selected sprint</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MOCK_TASKS.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{/* placeholder for drag handle */}</TableCell>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={task.assignee.imageUrl}
                  alt={task.assignee.initials}
                />
                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="uppercase">
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>
              {task.status === "Done" ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : task.status === "In Progress" ? (
                <Edit2 className="text-primary h-4 w-4" />
              ) : (
                <XCircle className="text-muted-foreground h-4 w-4" />
              )}
            </TableCell>
            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
            <TableCell className="flex justify-end space-x-1">
              <button className="text-muted-foreground hover:text-primary">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

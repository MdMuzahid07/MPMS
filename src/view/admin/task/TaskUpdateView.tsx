import { TaskUpsertForm } from "@/components/tasks/TaskUpsertForm";

type TaskUpdatePageProps = {
  params: {
    id: string;
    sprintId: string;
    taskId: string;
  };
};

export default function TaskUpdateView({ params }: TaskUpdatePageProps) {
  return (
    <TaskUpsertForm
      mode="update"
      projectId={params.id}
      sprintId={params.sprintId}
      taskId={params.taskId}
    />
  );
}

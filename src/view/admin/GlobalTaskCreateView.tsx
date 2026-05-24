import { TaskUpsertForm } from "@/components/features/tasks/TaskUpsertForm";

export default function GlobalTaskCreateView() {
  return (
    <TaskUpsertForm mode="create" projectId="nc-4902" sprintId="sprint-42" />
  );
}

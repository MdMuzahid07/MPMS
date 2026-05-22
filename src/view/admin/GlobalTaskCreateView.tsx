import { TaskUpsertForm } from "@/components/tasks/TaskUpsertForm";

export default function GlobalTaskCreateView() {
  return (
    <TaskUpsertForm mode="create" projectId="nc-4902" sprintId="sprint-42" />
  );
}

import { TaskUpsertForm } from "@/components/features/tasks/TaskUpsertForm";

type NewTaskPageProps = {
  params: {
    id: string;
    sprintId: string;
  };
};

export default function SprintTaskCreateView({ params }: NewTaskPageProps) {
  return (
    <TaskUpsertForm
      mode="create"
      projectId={params.id}
      sprintId={params.sprintId}
    />
  );
}

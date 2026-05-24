import { SprintUpsertForm } from "@/components/features/projects/SprintUpsertForm";

type SprintEditPageProps = {
  params: { id: string; sprintId: string };
};

export default function SprintEditView({ params }: SprintEditPageProps) {
  const { id, sprintId } = params;

  return <SprintUpsertForm mode="edit" projectId={id} sprintId={sprintId} />;
}

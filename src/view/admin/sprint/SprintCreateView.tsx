import { SprintUpsertForm } from "@/components/features/projects/SprintUpsertForm";

type SprintCreatePageProps = {
  params: { id: string };
};

export default function SprintCreateView({ params }: SprintCreatePageProps) {
  const { id } = params;

  return <SprintUpsertForm mode="create" projectId={id} />;
}

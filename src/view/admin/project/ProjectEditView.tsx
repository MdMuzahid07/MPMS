import { ProjectEditForm } from "@/components/features/projects/ProjectEditForm";

type EditProjectPageProps = {
  id: string;
};

export default function ProjectEditView({ id }: EditProjectPageProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-2">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Projects / Edit
        </h1>
      </div>
      <ProjectEditForm projectId={id} />
    </div>
  );
}

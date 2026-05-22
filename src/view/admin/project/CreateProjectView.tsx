import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

export default function CreateProjectView() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Projects / New
          </h1>
        </div>
      </div>

      <CreateProjectForm />
    </div>
  );
}

import ProjectEditView from "@/view/admin/project/ProjectEditView";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditView id={id} />;
}

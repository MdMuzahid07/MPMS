import ProjectDetailsView from "../../../../../view/admin/project/ProjectDetailsView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailsView id={id} />;
}

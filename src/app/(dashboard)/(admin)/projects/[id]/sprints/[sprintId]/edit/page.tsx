import SprintEditView from "../../../../../../../../view/admin/sprint/SprintEditView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; sprintId: string }>;
}) {
  const resolvedParams = await params;
  return <SprintEditView params={resolvedParams} />;
}

import SprintDetailView from "../../../../../../../view/admin/sprint/SprintDetailsView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; sprintId: string }>;
}) {
  const resolvedParams = await params;
  return <SprintDetailView params={resolvedParams} />;
}

import SprintTaskCreateView from "../../../../../../../../../view/admin/sprint/SprintTaskCreateView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; sprintId: string }>;
}) {
  const resolvedParams = await params;
  return <SprintTaskCreateView params={resolvedParams} />;
}

import SprintTaskCreateView from "../../../../../../../../../view/admin/sprint/SprintTaskCreateView";

export default function page({
  params,
}: {
  params: { id: string; sprintId: string };
}) {
  return <SprintTaskCreateView params={params} />;
}

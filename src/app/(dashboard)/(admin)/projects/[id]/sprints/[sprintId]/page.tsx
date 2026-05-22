import SprintDetailView from "../../../../../../../view/admin/sprint/SprintDetailsView";

export default function page({
  params,
}: {
  params: { id: string; sprintId: string };
}) {
  return <SprintDetailView params={params} />;
}

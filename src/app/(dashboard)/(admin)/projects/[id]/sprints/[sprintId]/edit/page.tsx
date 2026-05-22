import SprintEditView from "../../../../../../../../view/admin/sprint/SprintEditView";

export default function page({
  params,
}: {
  params: { id: string; sprintId: string };
}) {
  return <SprintEditView params={params} />;
}

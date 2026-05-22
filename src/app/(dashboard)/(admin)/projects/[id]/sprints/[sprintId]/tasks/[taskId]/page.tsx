import TaskUpdateView from "../../../../../../../../../view/admin/task/TaskUpdateView";

export default function page({
  params,
}: {
  params: { id: string; sprintId: string; taskId: string };
}) {
  return <TaskUpdateView params={params} />;
}

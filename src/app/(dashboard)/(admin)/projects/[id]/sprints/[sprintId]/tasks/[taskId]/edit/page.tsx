import TaskUpdateView from "@/view/admin/task/TaskUpdateView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; sprintId: string; taskId: string }>;
}) {
  const resolvedParams = await params;
  return <TaskUpdateView params={resolvedParams} />;
}

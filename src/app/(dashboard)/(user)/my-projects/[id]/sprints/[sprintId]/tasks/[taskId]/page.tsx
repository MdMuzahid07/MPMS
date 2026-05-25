import TaskDetailsView from "@/view/admin/task/TaskDetailsView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string; sprintId: string; taskId: string }>;
}) {
  const resolvedParams = await params;
  return <TaskDetailsView params={resolvedParams} showEdit={false} />;
}

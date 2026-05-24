import SprintCreateView from "../../../../../../../view/admin/sprint/SprintCreateView";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <SprintCreateView params={resolvedParams} />;
}

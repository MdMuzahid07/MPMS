import SprintCreateView from "../../../../../../../view/admin/sprint/SprintCreateView";

export default function page({ params }: { params: { id: string } }) {
  return <SprintCreateView params={params} />;
}

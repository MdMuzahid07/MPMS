import ProjectDetailsView from "../../../../../view/admin/project/ProjectDetailsView";

export default function page({ params }: { params: { id: string } }) {
  return <ProjectDetailsView params={params} />;
}

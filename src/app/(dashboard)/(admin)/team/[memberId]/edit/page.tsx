import TeamMemberEditView from "../../../../../../view/admin/team/TeamMemberEditView";

export default function page({ params }: { params: { memberId: string } }) {
  return <TeamMemberEditView params={params} />;
}

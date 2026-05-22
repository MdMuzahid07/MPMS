import TeamMemberDetailsView from "../../../../../view/admin/team/TeamMemberDetailsView";

export default function page({ params }: { params: { memberId: string } }) {
  return <TeamMemberDetailsView memberId={params.memberId} />;
}

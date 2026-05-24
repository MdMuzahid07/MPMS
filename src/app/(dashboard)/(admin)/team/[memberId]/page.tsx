import TeamMemberDetailsView from "../../../../../view/admin/team/TeamMemberDetailsView";

export default async function page({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  return <TeamMemberDetailsView memberId={memberId} />;
}

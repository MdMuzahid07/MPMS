import TeamMemberEditView from "../../../../../../view/admin/team/TeamMemberEditView";

export default async function page({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  return <TeamMemberEditView memberId={memberId} />;
}

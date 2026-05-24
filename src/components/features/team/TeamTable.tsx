"use client";

import type { TeamMember } from "./team.types";
import { TeamMemberRow } from "./TeamMemberRow";

interface TeamTableProps {
  members: TeamMember[];
  onSuspendToggle: (member: TeamMember) => void;
}

export const TeamTable = ({ members, onSuspendToggle }: TeamTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-245 border-collapse">
        <thead className="bg-muted/35">
          <tr className="border-border border-b">
            <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
              Member
            </th>
            <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
              Role
            </th>
            <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
              Department
            </th>
            <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
              Skills
            </th>
            <th className="text-muted-foreground px-5 py-3 text-right text-[10px] font-semibold tracking-[0.14em] uppercase">
              Status
            </th>
            <th className="w-12 px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              onSuspendToggle={onSuspendToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

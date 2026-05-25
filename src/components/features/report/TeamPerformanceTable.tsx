"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TeamMemberRow } from "./TeamMemberRow";
import { TeamReportItem } from "./report.types";

interface TeamPerformanceTableProps {
  members: TeamReportItem[];
  onExportCSV?: () => void;
}

export const TeamPerformanceTable = ({
  members,
  onExportCSV,
}: TeamPerformanceTableProps) => {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Team Performance Breakdown
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-2 text-xs"
          onClick={onExportCSV}
        >
          <Download className="mr-1 size-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse">
          <thead className="bg-muted/20">
            <tr className="border-border-y">
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Member
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Task Completion
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Efficiency
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold tracking-[0.12em] uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center text-sm italic"
                >
                  No team members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <TeamMemberRow key={member.id} member={member} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

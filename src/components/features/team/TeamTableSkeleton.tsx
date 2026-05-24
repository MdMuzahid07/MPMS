import { Skeleton } from "@/components/ui/skeleton";

export const TeamTableSkeleton = () => (
  <div className="animate-in fade-in overflow-x-auto duration-200">
    <table className="w-full min-w-245 border-collapse">
      <thead className="bg-muted/35">
        <tr className="border-border border-b">
          <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
            Member
          </th>
          <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
            Role
          </th>
          <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
            Department
          </th>
          <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
            Skills
          </th>
          <th className="text-muted-foreground px-5 py-3 text-right text-[10px] font-semibold tracking-wider uppercase">
            Status
          </th>
          <th className="w-12 px-5 py-3" />
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-border border-b">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </td>
            <td className="px-5 py-3.5">
              <Skeleton className="h-5.5 w-16 rounded-full" />
            </td>
            <td className="px-5 py-3.5">
              <Skeleton className="h-3.5 w-24" />
            </td>
            <td className="px-5 py-3.5">
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            </td>
            <td className="flex justify-end px-5 py-3.5">
              <Skeleton className="h-5 w-12 rounded-full" />
            </td>
            <td className="px-5 py-3.5">
              <Skeleton className="h-6 w-6 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TeamTableSkeleton;

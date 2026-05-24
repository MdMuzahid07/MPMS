import { Users } from "lucide-react";

export const TeamEmptyState = () => (
  <div className="animate-in fade-in flex flex-col items-center justify-center p-12 text-center duration-200">
    <Users className="text-muted-foreground/35 mb-4 size-10" />
    <h3 className="text-foreground text-sm font-semibold">No Members Found</h3>
    <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
      We hadn&apos;t found any team members matching your filter or query
      configuration.
    </p>
  </div>
);

export default TeamEmptyState;

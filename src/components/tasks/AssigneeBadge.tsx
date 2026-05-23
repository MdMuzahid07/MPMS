"use client";

interface AssigneeBadgeProps {
  name: string;
}

export const AssigneeBadge = ({ name }: AssigneeBadgeProps) => {
  if (name === "Unassigned") {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-muted text-muted-foreground inline-flex size-5 items-center justify-center rounded-full text-[9px] font-semibold">
          UN
        </span>
        <span className="text-muted-foreground text-xs italic">{name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary/85 text-primary-foreground inline-flex size-5 items-center justify-center rounded-full text-[9px] font-semibold">
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <span className="text-xs">{name}</span>
    </div>
  );
};

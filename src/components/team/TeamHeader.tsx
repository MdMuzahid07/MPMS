"use client";

interface TeamHeaderProps {
  title: string;
  description: string;
}

export const TeamHeader = ({ title, description }: TeamHeaderProps) => {
  return (
    <div>
      <h2 className="text-foreground text-[30px] leading-tight font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
};

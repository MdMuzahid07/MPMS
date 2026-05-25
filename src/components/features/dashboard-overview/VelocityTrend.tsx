"use client";

const VELOCITY_BARS = [26, 41, 33, 52, 37, 68];

export const VelocityTrend = () => {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.12em] uppercase">
        Velocity Trend
      </p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight">+22%</p>
        <div className="flex items-end gap-1">
          {VELOCITY_BARS.map((height, index) => (
            <span
              key={index}
              className="bg-primary/65 w-1.5 rounded-sm"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VelocityTrend;

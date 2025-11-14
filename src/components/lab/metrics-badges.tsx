"use client";

type Badge = {
  label: string;
  value: string | number;
};

type MetricsBadgesProps = {
  metrics?: Badge[];
};

export const MetricsBadges = ({ metrics }: MetricsBadgesProps) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {metrics.map((m, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px]"
        >
          <span className="mr-1 text-muted-foreground">{m.label}</span>
          <span className="font-medium">{m.value}</span>
        </span>
      ))}
    </div>
  );
};



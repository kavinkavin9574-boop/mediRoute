import { priorityOf, type Severity } from "@/lib/emergency";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  CRITICAL: "bg-destructive/12 text-destructive border-destructive/30",
  HIGH: "bg-warning/15 text-warning border-warning/35",
  MODERATE: "bg-primary/10 text-primary border-primary/25",
  LOW: "bg-success/12 text-success border-success/30",
};

export function PriorityBadge({ severity }: { severity: Severity }) {
  const p = priorityOf(severity);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide",
        styles[p],
      )}
    >
      {p}
    </span>
  );
}

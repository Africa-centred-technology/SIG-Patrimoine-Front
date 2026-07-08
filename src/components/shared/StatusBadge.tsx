interface StatusBadgeProps {
  label: string;
  tone?: "green" | "red" | "orange" | "gray" | "amber" | "blue" | "emerald" | "slate";
}
const MAP: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  green: "bg-green-100 text-green-700 ring-1 ring-green-200",
  red: "bg-red-100 text-red-700 ring-1 ring-red-200",
  orange: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  gray: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  amber: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  blue: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  emerald: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};
export function StatusBadge({ label, tone = "gray" }: StatusBadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${MAP[tone]}`}>{label}</span>;
}

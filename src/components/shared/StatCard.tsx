import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  color?: string; // tailwind bg-* text-*
}

export function StatCard({ icon: Icon, label, value, hint, color = "bg-slate-100 text-slate-700" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">{label}</div>
          <div className="text-2xl font-bold text-slate-900 leading-tight truncate">{value}</div>
        </div>
      </div>
      {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

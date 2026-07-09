import type { ReactNode } from "react";

interface ModuleHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

// En-tête standard d'un module (structure identique sur toutes les pages).
export function ModuleHeader({ title, subtitle, actions }: ModuleHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

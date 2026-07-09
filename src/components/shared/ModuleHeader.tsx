import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";

interface ModuleHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Chemin de fermeture : affiche un « X » qui ferme la page et y navigue (ex. la carte). */
  closeTo?: string;
}

// En-tête standard d'un module (structure identique sur toutes les pages).
export function ModuleHeader({ title, subtitle, actions, closeTo }: ModuleHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {closeTo && (
          <button
            onClick={() => navigate({ to: closeTo })}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Fermer et revenir à la carte"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

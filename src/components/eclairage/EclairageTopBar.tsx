import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Bell, LogOut, Clock as ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useApp } from "@/contexts/AppContext";

// Horloge live en pastille (client-only pour éviter un mismatch d'hydratation SSR).
function ClockPill() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <div className="hidden lg:block w-28" />;
  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
      <ClockIcon className="w-4 h-4 text-amber-600" />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {format(now, "HH:mm:ss")}
        </span>
        <span className="text-[10px] text-slate-500 capitalize mt-0.5">
          {format(now, "EEEE d MMM", { locale: fr })}
        </span>
      </div>
    </div>
  );
}

// Bloc droit réutilisable : horloge + notifications + utilisateur + déconnexion.
export function TopBarActions() {
  const { role, logout, impersonatedTenantId } = useApp();
  const navigate = useNavigate();
  const roleLabel = role === "SUPERADMIN" ? "ADMIN" : (role ?? "");
  return (
    <div className="flex items-center gap-3 md:gap-4 shrink-0">
      <ClockPill />
      <button className="p-2 rounded-lg hover:bg-slate-100 relative" title="Notifications">
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-slate-200 h-10">
        <div className="hidden md:flex flex-col items-end leading-none">
          <span className="text-xs font-bold text-slate-700 mb-0.5">Administrateur (démo)</span>
          <span className="text-[11px] text-slate-500">{roleLabel}</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
      </div>
      {!impersonatedTenantId && (
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function EclairageTopBar() {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-3 shrink-0">
      {/* GAUCHE : titre */}
      <div className="min-w-0 shrink-0">
        <h2 className="text-sm md:text-base font-bold text-slate-800 truncate leading-tight">
          Green Éclairage
        </h2>
        <div className="hidden sm:block text-[11px] text-slate-500 leading-none">
          SIG Patrimoine <span className="text-slate-300">/</span>{" "}
          <span className="text-amber-600 font-medium">Éclairage</span>
        </div>
      </div>

      {/* CENTRE : recherche */}
      <div className="hidden md:flex flex-1 justify-center max-w-2xl px-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition"
            placeholder="Rechercher un luminaire, une panne, un secteur…"
          />
        </div>
      </div>

      {/* DROITE : horloge + notifications + utilisateur */}
      <TopBarActions />
    </header>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Bell, LogOut } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useApp } from "@/contexts/AppContext";

// Horloge live (client-only pour éviter un mismatch d'hydratation SSR).
function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <div className="w-24" />;
  return (
    <div className="text-right leading-tight">
      <div className="text-sm font-semibold text-slate-800 tabular-nums">{format(now, "HH:mm:ss")}</div>
      <div className="text-[11px] text-slate-500 capitalize">{format(now, "EEEE d MMM", { locale: fr })}</div>
    </div>
  );
}

export function EclairageTopBar() {
  const { role, logout, impersonatedTenantId } = useApp();
  const navigate = useNavigate();
  const roleLabel = role === "SUPERADMIN" ? "ADMIN" : (role ?? "");

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-3 shrink-0">
      {/* Recherche */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Rechercher un luminaire, une panne, un secteur…"
        />
      </div>

      {/* Horloge + notifications + utilisateur */}
      <div className="flex items-center gap-4">
        <Clock />
        <button className="p-2 rounded-lg hover:bg-slate-100 relative" title="Notifications">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-sm font-medium text-slate-800">Administrateur (démo)</div>
            <div className="text-[11px] text-slate-500">{roleLabel}</div>
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
    </header>
  );
}

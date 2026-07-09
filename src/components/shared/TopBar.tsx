import { useNavigate } from "@tanstack/react-router";
import { LogOut, Bell, Search, Menu } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface TopBarProps {
  title: string;
  subtitle?: string;
  /** Affiche un bouton menu (hamburger) pour rouvrir la sidebar fermée. */
  onMenuClick?: () => void;
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const { logout, role, impersonatedTenantId } = useApp();
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            title="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="pl-8 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Rechercher…"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-slate-100 relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
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
        <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
          {role === "SUPERADMIN" ? "SA" : "TA"}
        </div>
      </div>
    </header>
  );
}

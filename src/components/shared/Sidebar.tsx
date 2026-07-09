import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ThemeTokens } from "@/lib/theme";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  theme: ThemeTokens;
  items: NavItem[];
  brandTop: React.ReactNode;
  brandSub?: string;
  footer?: React.ReactNode;
  /** Ferme entièrement la sidebar (affiche un « X » dans l'en-tête). */
  onClose?: () => void;
}

export function Sidebar({ theme, items, brandTop, brandSub, footer, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={`${theme.nav} ${collapsed ? "w-[72px]" : "w-[260px]"} shrink-0 h-screen sticky top-0 flex flex-col text-slate-100 border-r ${theme.navBorder} shadow-2xl transition-[width] duration-300`}
      style={{ transitionTimingFunction: "cubic-bezier(0.25,0.8,0.25,1)" }}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className={`h-9 w-9 rounded-lg ${theme.logoBadge} flex items-center justify-center font-bold text-white shadow-md shrink-0`}>
          SP
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{brandTop}</div>
            {brandSub && <div className="text-[11px] text-slate-400 truncate">{brandSub}</div>}
          </div>
        )}
        {!collapsed && onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg text-slate-400 ${theme.navHover} transition shrink-0`}
            title="Fermer le menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((it) => {
          const active = pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active ? theme.activeItem : `text-slate-300 ${theme.navHover}`
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
              {!collapsed && <span className="truncate">{it.label}</span>}
              {active && !collapsed && <span className="absolute right-2 h-1.5 w-1.5 bg-white rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-2 space-y-2">
        {!collapsed && footer}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-400 ${theme.navHover} transition`}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Réduire</>}
        </button>
      </div>
    </aside>
  );
}

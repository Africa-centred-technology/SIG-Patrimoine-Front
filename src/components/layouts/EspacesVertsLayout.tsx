import { Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Map, Trees, Layers, Users2, Package, Calendar, AlertTriangle, ClipboardList, Users, FileBarChart2, Settings } from "lucide-react";
import { useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { ImpersonationBanner } from "@/components/shared/ImpersonationBanner";
import { THEMES } from "@/lib/theme";
import { useApp, useTenant } from "@/contexts/AppContext";

const items = [
  { to: "/espaces-verts/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/espaces-verts/map", label: "Cartographie", icon: Map },
  { to: "/espaces-verts/inventory", label: "Inventaire", icon: Trees },
  { to: "/espaces-verts/sites", label: "Sites", icon: Layers },
  { to: "/espaces-verts/clients", label: "Clients", icon: Users2 },
  { to: "/espaces-verts/products", label: "Produits phyto", icon: Package },
  { to: "/espaces-verts/planning", label: "Planification", icon: Calendar },
  { to: "/espaces-verts/reclamations", label: "Réclamations", icon: AlertTriangle },
  { to: "/espaces-verts/suivi-taches", label: "Suivi des tâches", icon: ClipboardList },
  { to: "/espaces-verts/teams", label: "RH / Équipes", icon: Users },
  { to: "/espaces-verts/reporting", label: "Rapports", icon: FileBarChart2 },
  { to: "/espaces-verts/parametres", label: "Paramètres", icon: Settings },
];

export function EspacesVertsLayout() {
  const { role, effectiveTenantId, hydrated } = useApp();
  const tenant = useTenant(effectiveTenantId);
  const navigate = useNavigate();
  useEffect(() => {
    if (hydrated && (!role || !effectiveTenantId)) navigate({ to: "/" });
  }, [hydrated, role, effectiveTenantId, navigate]);
  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-emerald-50/30">
      <Sidebar
        theme={THEMES.espacesVerts}
        items={items}
        brandTop="Espaces Verts"
        brandSub={tenant?.nom ?? "—"}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ImpersonationBanner />
        <TopBar title="Espaces Verts" subtitle={tenant?.nom} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

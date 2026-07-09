import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  Lightbulb,
  Layers,
  Calendar,
  AlertTriangle,
  Wrench,
  Users,
  FileBarChart2,
  Settings,
} from "lucide-react";
import { useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { ImpersonationBanner } from "@/components/shared/ImpersonationBanner";
import { THEMES } from "@/lib/theme";
import { useApp, useTenant } from "@/contexts/AppContext";

const items = [
  { to: "/eclairage/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/eclairage/map", label: "Cartographie", icon: Map },
  { to: "/eclairage/inventory", label: "Inventaire luminaires", icon: Lightbulb },
  { to: "/eclairage/sites", label: "Zones / Secteurs", icon: Layers },
  { to: "/eclairage/planning", label: "Planification", icon: Calendar },
  { to: "/eclairage/reclamations", label: "Signalements", icon: AlertTriangle },
  { to: "/eclairage/interventions", label: "Interventions", icon: Wrench },
  { to: "/eclairage/teams", label: "Techniciens", icon: Users },
  { to: "/eclairage/reporting", label: "Rapports", icon: FileBarChart2 },
  { to: "/eclairage/parametres", label: "Paramètres", icon: Settings },
];

export function EclairageLayout() {
  const { role, effectiveTenantId, hydrated } = useApp();
  const tenant = useTenant(effectiveTenantId);
  const navigate = useNavigate();
  useEffect(() => {
    if (hydrated && (!role || !effectiveTenantId)) navigate({ to: "/" });
  }, [hydrated, role, effectiveTenantId, navigate]);
  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar
        theme={THEMES.eclairage}
        items={items}
        brandTop="Green Éclairage"
        brandSub={tenant?.nom ?? "—"}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ImpersonationBanner />
        <TopBar title="Green Éclairage" subtitle={tenant?.nom} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

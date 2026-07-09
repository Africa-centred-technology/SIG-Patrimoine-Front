import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
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
import { ImpersonationBanner } from "@/components/shared/ImpersonationBanner";
import { EclairageMap } from "@/components/eclairage/EclairageMap";
import { EclairageTopBar, TopBarActions } from "@/components/eclairage/EclairageTopBar";
import { EclairageMapSearch } from "@/components/eclairage/EclairageMapSearch";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && (!role || !effectiveTenantId)) navigate({ to: "/" });
  }, [hydrated, role, effectiveTenantId, navigate]);
  if (!hydrated) return null;

  const isMapView = pathname === "/eclairage/map" || pathname === "/eclairage";

  return (
    <div className="flex h-screen overflow-hidden bg-stone-900">
      <Sidebar
        theme={THEMES.eclairage}
        items={items}
        brandTop="Green Éclairage"
        brandSub={tenant?.nom ?? "—"}
      />

      {/* Zone principale : carte persistante + barre/panneau flottants */}
      <div className="relative flex-1 min-w-0">
        {/* Layer 0 — carte toujours présente (interactive seulement sur la vue carte) */}
        <div className={`absolute inset-0 ${isMapView ? "" : "pointer-events-none"}`}>
          <EclairageMap active={isMapView} />
        </div>

        {isMapView ? (
          /* Vue carte : recherche compacte flottante (gauche) + actions (droite) */
          <>
            <EclairageMapSearch />
            <div className="absolute top-4 right-4 z-30 pointer-events-auto bg-white/90 backdrop-blur-md shadow-xl rounded-xl border border-white/20 ring-1 ring-black/5 px-3 py-1.5">
              <TopBarActions />
            </div>
          </>
        ) : (
          /* Vue module : panneau flottant avec la barre du haut en tête */
          <div className="absolute inset-0 md:inset-4 z-20 flex flex-col bg-white/95 backdrop-blur-xl md:rounded-2xl md:border md:border-white/20 shadow-2xl overflow-hidden">
            <ImpersonationBanner />
            <EclairageTopBar />
            <div className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

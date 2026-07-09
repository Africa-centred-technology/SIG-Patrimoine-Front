import { useNavigate } from "@tanstack/react-router";
import { Trees, LayoutGrid } from "lucide-react";
import { useEffect } from "react";
import { ImpersonationBanner } from "@/components/shared/ImpersonationBanner";
import { useApp, useTenant } from "@/contexts/AppContext";

// URL de l'application « Espaces Verts » complète (greensig-front) embarquée.
// En dev, elle tourne sur son propre serveur Vite (port 3000).
// En prod, servir son build et pointer VITE_EV_APP_URL vers ce chemin.
const EV_APP_URL =
  (import.meta as any).env?.VITE_EV_APP_URL ?? "http://localhost:3000";

/**
 * Le produit « Espaces Verts » est l'application greensig-front COMPLÈTE,
 * embarquée telle quelle (elle apporte sa propre sidebar/layout/thème emerald).
 * On l'affiche en iframe plein cadre, coiffée uniquement du chrome plateforme
 * (bandeau d'impersonation + barre de produit).
 */
export function EspacesVertsLayout() {
  const { role, effectiveTenantId, hydrated } = useApp();
  const tenant = useTenant(effectiveTenantId);
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && (!role || !effectiveTenantId)) navigate({ to: "/" });
  }, [hydrated, role, effectiveTenantId, navigate]);

  if (!hydrated) return null;

  // Contexte transmis à l'app embarquée (lecture future côté greensig-front).
  const params = new URLSearchParams({
    embedded: "1",
    theme: "emerald",
    tenant: effectiveTenantId ?? "",
    tenantNom: tenant?.nom ?? "",
  });
  const src = `${EV_APP_URL}?${params.toString()}`;

  return (
    <div className="flex flex-col h-screen bg-emerald-50/30">
      <ImpersonationBanner />

      {/* Barre produit (chrome plateforme au-dessus de l'app embarquée) */}
      <div className="flex items-center justify-between bg-emerald-900 text-emerald-50 px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Trees size={18} className="text-emerald-300" />
          <span className="font-semibold">Espaces Verts</span>
          <span className="text-emerald-300/70">·</span>
          <span className="text-sm text-emerald-100/90">{tenant?.nom ?? "—"}</span>
        </div>
        <button
          onClick={() => navigate({ to: "/select-product" })}
          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-md px-3 py-1 text-xs font-medium transition"
        >
          <LayoutGrid size={14} /> Changer de produit
        </button>
      </div>

      {/* Application greensig-front complète */}
      <iframe
        title="Espaces Verts — application"
        src={src}
        className="flex-1 w-full border-0"
      />
    </div>
  );
}

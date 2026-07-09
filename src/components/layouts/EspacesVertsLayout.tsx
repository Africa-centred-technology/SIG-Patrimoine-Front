import { Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

/**
 * Layout du produit « Espaces Verts ».
 *
 * Espaces Verts est l'application greensig-front, intégrée NATIVEMENT (même build,
 * pas d'iframe) : elle est montée par EspacesVertsHost via les routes enfant
 * (index + splat) et apporte son propre layout / sidebar / thème emerald.
 *
 * Ce layout ne fait donc que : garder l'accès (auth) + rendre l'app (Outlet) +
 * un bouton flottant pour revenir à la console plateforme.
 */
export function EspacesVertsLayout() {
  const { role, effectiveTenantId, impersonatedTenantId, hydrated, stopImpersonation } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && (!role || !effectiveTenantId)) navigate({ to: "/" });
  }, [hydrated, role, effectiveTenantId, navigate]);

  if (!hydrated) return null;

  const backToConsole = () => {
    if (impersonatedTenantId) {
      const id = impersonatedTenantId;
      stopImpersonation();
      navigate({ to: "/platform/tenants/$id", params: { id } });
    } else {
      navigate({ to: "/select-product" });
    }
  };

  return (
    <>
      <Outlet />
      {/* Bouton flottant vers la console (n'interfère pas avec le plein écran) */}
      <button
        onClick={backToConsole}
        className="fixed top-3 right-3 z-[9999] inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1.5 text-xs font-medium shadow-lg transition"
        title="Revenir à la console SIG Patrimoine"
      >
        <LayoutGrid size={14} /> Console
      </button>
    </>
  );
}

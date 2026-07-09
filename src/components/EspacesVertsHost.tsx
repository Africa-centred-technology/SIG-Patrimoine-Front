import { useEffect, useState, type ComponentType } from "react";

/**
 * Hôte client-only du produit « Espaces Verts ».
 *
 * L'application greensig-front (apps/espaces-verts) est client-only : elle crée
 * son routeur react-router (createBrowserRouter) et touche window/localStorage
 * au chargement du module. On l'importe donc DYNAMIQUEMENT dans un effet (jamais
 * côté serveur), pour éviter tout crash SSR de la console TanStack Start.
 *
 * L'app est montée telle quelle, avec basename /espaces-verts (voir App.tsx) :
 * elle apporte son propre layout, sa sidebar et son thème emerald.
 */
export function EspacesVertsHost() {
  const [App, setApp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // greensig-front et certaines libs lisent process.env.* : shim client minimal.
    (globalThis as any).process ??= { env: { NODE_ENV: import.meta.env.MODE } };
    import("../../apps/espaces-verts/App")
      .then((m) => {
        if (mounted) setApp(() => m.default as ComponentType);
      })
      .catch((e) => {
        if (mounted) setError(String(e?.message ?? e));
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Erreur au chargement de l'application Espaces Verts : {error}
      </div>
    );
  }

  if (!App) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Chargement de l'application Espaces Verts…
      </div>
    );
  }

  return <App />;
}

import { createFileRoute } from "@tanstack/react-router";
import { Trees, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/platform/products")({
  component: Products,
});

function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Catalogue des produits</h2>
        <p className="text-sm text-slate-500">Les produits disponibles sur la plateforme SIG Patrimoine.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl overflow-hidden border shadow-sm bg-white">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-950 text-white p-6">
            <Trees className="h-10 w-10 mb-3" />
            <h3 className="text-xl font-bold">Espaces Verts</h3>
            <p className="text-sm text-emerald-100 mt-1">SIG de gestion du patrimoine végétal.</p>
          </div>
          <div className="p-5 text-sm text-slate-700 space-y-2">
            <div>15 types d'objets · Cartographie · Planification · Réclamations · RH · Rapports</div>
            <div className="text-xs text-slate-500">Palette Emerald · Thème végétal / nature</div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-sm bg-white">
          <div className="bg-gradient-to-br from-amber-500 to-stone-900 text-white p-6">
            <Lightbulb className="h-10 w-10 mb-3" />
            <h3 className="text-xl font-bold">Green Éclairage</h3>
            <p className="text-sm text-amber-100 mt-1">SIG de gestion du patrimoine d'éclairage public.</p>
          </div>
          <div className="p-5 text-sm text-slate-700 space-y-2">
            <div>Luminaires · Réseau électrique · Pannes · Énergie & bilan carbone · Interventions</div>
            <div className="text-xs text-slate-500">Palette Ambre & Nuit · Thème lumière / énergie</div>
          </div>
        </div>
      </div>
    </div>
  );
}

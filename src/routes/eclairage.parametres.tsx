import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/eclairage/parametres")({ component: Params });
function Params() {
  const sections = ["Types de luminaires", "Calendriers d'allumage (astronomique / horaire)", "Seuils d'alerte consommation", "Catalogue de matériel", "Tarifs énergie"];
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Paramètres — Green Éclairage</h2>
      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {sections.map(s => (
          <div key={s} className="p-4 flex items-center justify-between hover:bg-amber-50/40">
            <span className="text-sm text-slate-800 font-medium">{s}</span>
            <span className="text-xs text-slate-400">Configurer</span>
          </div>
        ))}
      </div>
    </div>
  );
}

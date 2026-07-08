import { createFileRoute } from "@tanstack/react-router";
import { ZONES, LUMINAIRES } from "@/lib/mockData";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/eclairage/sites")({ component: Zones });

function Zones() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Zones / Secteurs d'éclairage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ZONES.map(z => {
          const lums = LUMINAIRES.filter(l => l.site_id === z.id);
          const panne = lums.filter(l => l.etat === "EN_PANNE").length;
          return (
            <div key={z.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{z.nom}</h3>
                  <p className="text-xs text-slate-500 mt-1">Calendrier : {z.calendrier_allumage}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center"><Layers className="text-amber-700" size={18} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div><div className="text-xl font-bold">{lums.length}</div><div className="text-xs text-slate-500">Luminaires</div></div>
                <div><div className="text-xl font-bold text-amber-600">{z.puissance_totale_kw} kW</div><div className="text-xs text-slate-500">Puissance</div></div>
                <div><div className={`text-xl font-bold ${panne > 0 ? "text-red-600" : "text-emerald-600"}`}>{panne}</div><div className="text-xs text-slate-500">En panne</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

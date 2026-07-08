import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
export const Route = createFileRoute("/eclairage/teams")({ component: Teams });
const TECHS = [
  { id: 1, nom: "Hicham Amrani", equipe: "Réseau Nord", habilitations: ["B1", "B2", "BR"] },
  { id: 2, nom: "Salma Berrada", equipe: "Réseau Sud", habilitations: ["B1", "BR"] },
  { id: 3, nom: "Karim Fadili", equipe: "Maintenance", habilitations: ["B2", "BC", "BR"] },
  { id: 4, nom: "Nadia El Mansouri", equipe: "Astreinte", habilitations: ["B1", "BR"] },
];
function Teams() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Techniciens & habilitations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TECHS.map(t => (
          <div key={t.id} className="bg-white rounded-xl border p-5 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">{t.nom.split(" ").map(x => x[0]).join("")}</div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{t.nom}</div>
              <div className="text-xs text-slate-500">{t.equipe}</div>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                {t.habilitations.map(h => <StatusBadge key={h} label={h} tone="blue" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

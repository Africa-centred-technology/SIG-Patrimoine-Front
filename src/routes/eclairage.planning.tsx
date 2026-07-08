import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const Route = createFileRoute("/eclairage/planning")({ component: Planning });

const TASKS = [
  { id: "t1", titre: "Relamping — Centre-ville", type: "Relamping", statut: "PLANIFIEE", tone: "blue", date: "2026-07-12", technicien: "H. Amrani", priorite: 3 },
  { id: "t2", titre: "Ronde de contrôle — Zone Nord", type: "Ronde", statut: "EN_COURS", tone: "orange", date: "2026-07-08", technicien: "S. Berrada", priorite: 2 },
  { id: "t3", titre: "Maintenance armoire ARM-003", type: "Curative", statut: "PLANIFIEE", tone: "blue", date: "2026-07-10", technicien: "K. Fadili", priorite: 5 },
  { id: "t4", titre: "Remplacement luminaire LUM-0007", type: "Remplacement", statut: "TERMINEE", tone: "green", date: "2026-07-05", technicien: "S. Berrada", priorite: 4 },
];

function Planning() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Planification des interventions</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Intervention</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-center px-4 py-3">Prio</th>
              <th className="text-left px-4 py-3">Technicien</th>
              <th className="text-left px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {TASKS.map(t => (
              <tr key={t.id} className="hover:bg-amber-50/40">
                <td className="px-4 py-3 font-medium">{t.titre}</td>
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3">{t.date}</td>
                <td className="px-4 py-3 text-center"><span className={`inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-bold text-white ${t.priorite >= 4 ? "bg-red-500" : "bg-amber-500"}`}>{t.priorite}</span></td>
                <td className="px-4 py-3">{t.technicien}</td>
                <td className="px-4 py-3"><StatusBadge label={t.statut} tone={t.tone as any} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PANNES } from "@/lib/mockData";
import type { StatutPanne } from "@/lib/types";

export const Route = createFileRoute("/eclairage/reclamations")({ component: Pannes });

const TONE: Record<StatutPanne, "red" | "orange" | "green" | "gray"> = {
  NOUVEAU: "red", EN_COURS: "orange", RESOLU: "green", CLOTURE: "gray",
};

function Pannes() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Signalements de panne</h2>
        <p className="text-sm text-slate-500">{PANNES.length} signalements · cycle Nouveau → En cours → Résolu → Clôturé</p>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-center px-4 py-3">Urgence</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PANNES.map(p => (
              <tr key={p.id} className="hover:bg-amber-50/40">
                <td className="px-4 py-3 font-medium">{p.reference}</td>
                <td className="px-4 py-3"><StatusBadge label={p.type.replace("_", " ")} tone="amber" /></td>
                <td className="px-4 py-3 text-slate-700">{p.description}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-bold text-white ${p.urgence >= 4 ? "bg-red-500" : p.urgence >= 3 ? "bg-orange-500" : "bg-slate-400"}`}>{p.urgence}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge label={p.statut} tone={TONE[p.statut]} /></td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.dateSignalement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

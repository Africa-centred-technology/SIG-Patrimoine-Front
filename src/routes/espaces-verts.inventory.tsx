import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EV_OBJETS } from "@/lib/mockData";

export const Route = createFileRoute("/espaces-verts/inventory")({ component: Inv });

function Inv() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Inventaire — Espaces Verts</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-xs uppercase text-emerald-800">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Espèce</th>
              <th className="text-left px-4 py-3">Site</th>
              <th className="text-left px-4 py-3">État</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {EV_OBJETS.map(o => (
              <tr key={o.id} className="hover:bg-emerald-50/40">
                <td className="px-4 py-3 font-medium">{o.ref}</td>
                <td className="px-4 py-3"><StatusBadge label={o.type} tone="emerald" /></td>
                <td className="px-4 py-3 text-slate-700">{o.espece}</td>
                <td className="px-4 py-3 text-slate-700">{o.site}</td>
                <td className="px-4 py-3"><StatusBadge label={o.etat} tone={o.etat === "Bon" ? "green" : "amber"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

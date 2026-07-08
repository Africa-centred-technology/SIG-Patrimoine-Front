import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
export const Route = createFileRoute("/eclairage/reporting")({ component: Reporting });
function Reporting() {
  const rapports = [
    { titre: "Rapport mensuel — Juin 2026", type: "Mensuel", pages: 24 },
    { titre: "Bilan carbone T2 2026", type: "Trimestriel", pages: 12 },
    { titre: "Rapport pannes semaine 27", type: "Hebdomadaire", pages: 6 },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Rapports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rapports.map(r => (
          <div key={r.titre} className="bg-white rounded-xl border p-5 shadow-sm">
            <FileText className="text-amber-500 mb-2" />
            <div className="font-semibold text-slate-900 text-sm">{r.titre}</div>
            <div className="text-xs text-slate-500 mt-1">{r.type} · {r.pages} pages</div>
            <div className="mt-4 flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-white flex items-center gap-1"><Download size={12} /> PDF</button>
              <button className="text-xs px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center gap-1"><Download size={12} /> Excel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

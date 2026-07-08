import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/eclairage/interventions")({ component: () => Simple() });
function Simple() {
  const items = [
    { ref: "INT-2026-021", lum: "LUM-0014", tech: "H. Amrani", duree: "45min", matos: "Ballast + LED 70W" },
    { ref: "INT-2026-020", lum: "LUM-0007", tech: "S. Berrada", duree: "30min", matos: "Driver LED 60W" },
    { ref: "INT-2026-019", lum: "LUM-0022", tech: "K. Fadili", duree: "1h20", matos: "Câblage + relamping" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Suivi des interventions électriques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(i => (
          <div key={i.ref} className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{i.ref}</div>
            <div className="text-xs text-slate-500 mb-3">Luminaire {i.lum}</div>
            <div className="text-sm space-y-1">
              <div><span className="text-slate-500">Technicien : </span>{i.tech}</div>
              <div><span className="text-slate-500">Durée : </span>{i.duree}</div>
              <div><span className="text-slate-500">Matériel : </span>{i.matos}</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-20 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-[10px] text-stone-600">📷 Avant</div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[10px] text-amber-700">📷 Après</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

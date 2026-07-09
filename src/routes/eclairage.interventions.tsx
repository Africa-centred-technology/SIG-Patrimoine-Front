import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, CheckCircle2, PlayCircle, Timer, Search, X } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { INTERVENTIONS, techNom, type Intervention } from "@/lib/mockEclairage";

export const Route = createFileRoute("/eclairage/interventions")({ component: InterventionsPage });

function InterventionsPage() {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<"all" | "EN_COURS" | "TERMINEE">("all");
  const [sel, setSel] = useState<Intervention | null>(null);
  const query = q.trim().toLowerCase();

  const filtered = INTERVENTIONS.filter(
    (i) =>
      (statut === "all" || i.statut === statut) &&
      (query === "" || i.reference.toLowerCase().includes(query) || i.luminaireId.toLowerCase().includes(query)),
  );
  const terminees = INTERVENTIONS.filter((i) => i.statut === "TERMINEE").length;
  const enCours = INTERVENTIONS.filter((i) => i.statut === "EN_COURS").length;
  const dureeMoy = Math.round(INTERVENTIONS.reduce((s, i) => s + i.duree_min, 0) / INTERVENTIONS.length);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Suivi des interventions électriques</h2>
        <p className="text-sm text-slate-500">{filtered.length} interventions · matériel, durée, technicien</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Wrench} label="Total" value={INTERVENTIONS.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckCircle2} label="Terminées" value={terminees} color="bg-green-100 text-green-700" />
        <StatCard icon={PlayCircle} label="En cours" value={enCours} color="bg-orange-100 text-orange-700" />
        <StatCard icon={Timer} label="Durée moy." value={`${dureeMoy} min`} color="bg-sky-100 text-sky-700" />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="text-sm border rounded-lg bg-white pl-9 pr-3 py-2 w-56 outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <select value={statut} onChange={(e) => setStatut(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous statuts</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINEE">Terminée</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Luminaire</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Technicien</th>
              <th className="text-right px-4 py-3">Durée</th>
              <th className="text-left px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((i) => (
              <tr key={i.id} onClick={() => setSel(i)} className="hover:bg-amber-50/40 cursor-pointer">
                <td className="px-4 py-3 font-medium text-slate-800">{i.reference}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{i.date}</td>
                <td className="px-4 py-3 text-slate-700">{i.luminaireId}</td>
                <td className="px-4 py-3 text-slate-600">{i.type}</td>
                <td className="px-4 py-3 text-slate-700">{techNom(i.technicienId)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{i.duree_min} min</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={i.statut === "TERMINEE" ? "Terminée" : "En cours"}
                    tone={i.statut === "TERMINEE" ? "green" : "orange"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-slate-900">{sel.reference}</h3>
              <button onClick={() => setSel(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <Row label="Date" value={sel.date} />
              <Row label="Luminaire" value={sel.luminaireId} />
              <Row label="Type" value={sel.type} />
              <Row label="Technicien" value={techNom(sel.technicienId)} />
              <Row label="Durée" value={`${sel.duree_min} min`} />
              <div className="pt-1">
                <div className="text-slate-500 mb-1">Matériel</div>
                <div className="flex flex-wrap gap-1.5">
                  {sel.materiel.map((m, k) => (
                    <span key={k} className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">{m}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-20 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-[10px] text-stone-600">📷 Avant</div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[10px] text-amber-700">📷 Après</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, PlayCircle, CheckCircle2, Search, X } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ZONES } from "@/lib/mockData";
import {
  TACHES_MAINT,
  techNom,
  type TacheMaint,
  type TypeTacheMaint,
  type StatutTache,
} from "@/lib/mockEclairage";

export const Route = createFileRoute("/eclairage/planning")({ component: PlanningPage });

const TYPE_LABEL: Record<TypeTacheMaint, string> = {
  RELAMPING: "Relamping",
  RONDE: "Ronde",
  PREVENTIVE: "Préventive",
  CURATIVE: "Curative",
  REMPLACEMENT: "Remplacement",
};
const STATUT_TONE: Record<StatutTache, "blue" | "orange" | "green"> = {
  PLANIFIEE: "blue",
  EN_COURS: "orange",
  TERMINEE: "green",
};
const STATUT_LABEL: Record<StatutTache, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};
const prioColor = (p: number) =>
  p >= 5 ? "bg-red-100 text-red-700" : p >= 3 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600";
const zoneNom = (id: string) => ZONES.find((z) => z.id === id)?.nom ?? id;

function PlanningPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | TypeTacheMaint>("all");
  const [statut, setStatut] = useState<"all" | StatutTache>("all");
  const [sel, setSel] = useState<TacheMaint | null>(null);
  const query = q.trim().toLowerCase();

  const filtered = TACHES_MAINT.filter(
    (t) =>
      (type === "all" || t.type === type) &&
      (statut === "all" || t.statut === statut) &&
      (query === "" || t.titre.toLowerCase().includes(query) || t.reference.toLowerCase().includes(query)),
  );
  const count = (s: StatutTache) => TACHES_MAINT.filter((t) => t.statut === s).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Planification des interventions</h2>
        <p className="text-sm text-slate-500">
          {filtered.length} interventions · relamping, rondes, maintenance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Calendar} label="Total" value={TACHES_MAINT.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Clock} label="Planifiées" value={count("PLANIFIEE")} color="bg-blue-100 text-blue-700" />
        <StatCard icon={PlayCircle} label="En cours" value={count("EN_COURS")} color="bg-orange-100 text-orange-700" />
        <StatCard icon={CheckCircle2} label="Terminées" value={count("TERMINEE")} color="bg-green-100 text-green-700" />
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
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={statut} onChange={(e) => setStatut(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous statuts</option>
          {Object.entries(STATUT_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Intervention</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-center px-4 py-3">Priorité</th>
              <th className="text-left px-4 py-3">Technicien</th>
              <th className="text-left px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} onClick={() => setSel(t)} className="hover:bg-amber-50/40 cursor-pointer">
                <td className="px-4 py-3 font-medium text-slate-800">{t.reference}</td>
                <td className="px-4 py-3 text-slate-700">{t.titre}</td>
                <td className="px-4 py-3 text-slate-600">{TYPE_LABEL[t.type]}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{t.date}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prioColor(t.priorite)}`}>
                    P{t.priorite}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{techNom(t.technicienId)}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={STATUT_LABEL[t.statut]} tone={STATUT_TONE[t.statut]} />
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
              <Row label="Intervention" value={sel.titre} />
              <Row label="Type" value={TYPE_LABEL[sel.type]} />
              <Row label="Statut" value={STATUT_LABEL[sel.statut]} />
              <Row label="Priorité" value={`P${sel.priorite}`} />
              <Row label="Date" value={sel.date} />
              <Row label="Technicien" value={techNom(sel.technicienId)} />
              <Row label="Secteur" value={zoneNom(sel.zoneId)} />
              {sel.luminaireId && <Row label="Luminaire" value={sel.luminaireId} />}
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

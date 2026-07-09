import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bell, PlayCircle, CheckCircle2, Search, X, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PANNES, ZONES } from "@/lib/mockData";
import type { Panne, StatutPanne, TypePanne } from "@/lib/types";

export const Route = createFileRoute("/eclairage/reclamations")({ component: PannesPage });

const TONE: Record<StatutPanne, "red" | "orange" | "green" | "gray"> = {
  NOUVEAU: "red",
  EN_COURS: "orange",
  RESOLU: "green",
  CLOTURE: "gray",
};
const STATUT_LABEL: Record<StatutPanne, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
  CLOTURE: "Clôturé",
};
const TYPE_LABEL: Record<TypePanne, string> = {
  LUMINAIRE_ETEINT: "Luminaire éteint",
  POINT_NOIR: "Point noir",
  CLIGNOTANT: "Clignotant",
  ARMOIRE_HS: "Armoire HS",
  CABLE_ENDOMMAGE: "Câble endommagé",
  VANDALISME: "Vandalisme",
};
const urgColor = (u: number) =>
  u >= 4 ? "bg-red-100 text-red-700" : u >= 3 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600";
const zoneNom = (id?: string) => ZONES.find((z) => z.id === id)?.nom ?? "—";

function PannesPage() {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<"all" | StatutPanne>("all");
  const [type, setType] = useState<"all" | TypePanne>("all");
  const [sel, setSel] = useState<Panne | null>(null);
  const query = q.trim().toLowerCase();

  const filtered = PANNES.filter(
    (p) =>
      (statut === "all" || p.statut === statut) &&
      (type === "all" || p.type === type) &&
      (query === "" || p.reference.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)),
  );
  const count = (s: StatutPanne) => PANNES.filter((p) => p.statut === s).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Signalements de panne</h2>
        <p className="text-sm text-slate-500">
          {filtered.length} signalements · cycle Nouveau → En cours → Résolu → Clôturé
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Bell} label="Nouveaux" value={count("NOUVEAU")} color="bg-red-100 text-red-700" />
        <StatCard icon={PlayCircle} label="En cours" value={count("EN_COURS")} color="bg-orange-100 text-orange-700" />
        <StatCard icon={CheckCircle2} label="Résolus" value={count("RESOLU")} color="bg-green-100 text-green-700" />
        <StatCard icon={AlertTriangle} label="Total" value={PANNES.length} color="bg-amber-100 text-amber-700" />
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
          {Object.entries(STATUT_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-center px-4 py-3">Urgence</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Carte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} onClick={() => setSel(p)} className="hover:bg-amber-50/40 cursor-pointer">
                <td className="px-4 py-3 font-medium text-slate-800">{p.reference}</td>
                <td className="px-4 py-3 text-slate-600">{TYPE_LABEL[p.type]}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{p.description}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgColor(p.urgence)}`}>
                    {p.urgence}/5
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{p.dateSignalement}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={STATUT_LABEL[p.statut]} tone={TONE[p.statut]} />
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  {p.luminaireId && (
                    <Link
                      to="/eclairage/map"
                      search={{ focus: p.luminaireId }}
                      className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium"
                    >
                      <MapPin size={14} /> Localiser
                    </Link>
                  )}
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
              <Row label="Type" value={TYPE_LABEL[sel.type]} />
              <Row label="Statut" value={STATUT_LABEL[sel.statut]} />
              <Row label="Urgence" value={`${sel.urgence}/5`} />
              <Row label="Date" value={sel.dateSignalement} />
              <Row label="Secteur" value={zoneNom(sel.zoneId)} />
              {sel.luminaireId && <Row label="Luminaire" value={sel.luminaireId} />}
              <div className="pt-2">
                <div className="text-slate-500 mb-1">Description</div>
                <div className="text-slate-800">{sel.description}</div>
              </div>
              {sel.luminaireId && (
                <Link
                  to="/eclairage/map"
                  search={{ focus: sel.luminaireId }}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg px-3 py-2 font-medium"
                >
                  <MapPin size={15} /> Localiser sur la carte
                </Link>
              )}
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

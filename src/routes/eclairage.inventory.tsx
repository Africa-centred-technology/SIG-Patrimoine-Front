import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Power, WrenchIcon, Leaf, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LUMINAIRES, ZONES } from "@/lib/mockData";
import type { EtatLuminaire, TypeLuminaire } from "@/lib/types";

export const Route = createFileRoute("/eclairage/inventory")({ component: InventoryPage });

const TYPE_COLOR: Record<TypeLuminaire, string> = {
  LED: "amber", SODIUM: "orange", PROJECTEUR: "amber", BORNE: "amber", APPLIQUE: "amber", GUIRLANDE: "blue",
} as any;

const ETAT_TONE: Record<EtatLuminaire, "green" | "gray" | "red" | "orange" | "amber"> = {
  ALLUME: "green", ETEINT: "gray", EN_PANNE: "red", MAINTENANCE: "orange", VETUSTE: "amber",
};

function InventoryPage() {
  const [type, setType] = useState<"all" | TypeLuminaire>("all");
  const [etat, setEtat] = useState<"all" | EtatLuminaire>("all");
  const [zone, setZone] = useState<string>("all");
  const filtered = LUMINAIRES.filter(l =>
    (type === "all" || l.type === type) &&
    (etat === "all" || l.etat === etat) &&
    (zone === "all" || l.site_id === zone)
  );
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Inventaire des luminaires</h2>
        <p className="text-sm text-slate-500">{filtered.length} luminaires · vue tabulaire unifiée</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Lightbulb} label="Total" value={LUMINAIRES.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Power} label="Allumés" value={LUMINAIRES.filter(l => l.etat === "ALLUME").length} color="bg-green-100 text-green-700" />
        <StatCard icon={AlertTriangle} label="En panne" value={LUMINAIRES.filter(l => l.etat === "EN_PANNE").length} color="bg-red-100 text-red-700" />
        <StatCard icon={Leaf} label="LED" value={LUMINAIRES.filter(l => l.type === "LED").length} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={WrenchIcon} label="Vétustes" value={LUMINAIRES.filter(l => l.etat === "VETUSTE").length} color="bg-amber-100 text-amber-800" />
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={type} onChange={e => setType(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous types</option>
          {(["LED", "SODIUM", "PROJECTEUR", "BORNE", "APPLIQUE", "GUIRLANDE"] as TypeLuminaire[]).map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={etat} onChange={e => setEtat(e.target.value as any)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous états</option>
          {(["ALLUME", "ETEINT", "EN_PANNE", "MAINTENANCE", "VETUSTE"] as EtatLuminaire[]).map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={zone} onChange={e => setZone(e.target.value)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Tous secteurs</option>
          {ZONES.map(z => <option key={z.id} value={z.id}>{z.nom}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Référence</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-right px-4 py-3">Puissance</th>
              <th className="text-left px-4 py-3">État</th>
              <th className="text-left px-4 py-3">Secteur</th>
              <th className="text-left px-4 py-3">Date pose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-amber-50/40">
                <td className="px-4 py-3 font-medium text-slate-800">{l.reference}</td>
                <td className="px-4 py-3"><StatusBadge label={l.type} tone={TYPE_COLOR[l.type] as any} /></td>
                <td className="px-4 py-3 text-right">{l.puissance_w} W</td>
                <td className="px-4 py-3"><StatusBadge label={l.etat} tone={ETAT_TONE[l.etat]} /></td>
                <td className="px-4 py-3 text-slate-700">{ZONES.find(z => z.id === l.site_id)?.nom}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{l.date_pose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

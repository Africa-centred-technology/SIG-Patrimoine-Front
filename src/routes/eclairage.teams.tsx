import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserCheck, UserMinus, ShieldCheck, Search, Phone } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TECHNICIENS, type StatutTech } from "@/lib/mockEclairage";

export const Route = createFileRoute("/eclairage/teams")({ component: TeamsPage });

const STATUT_TONE: Record<StatutTech, "green" | "orange" | "gray" | "blue"> = {
  DISPONIBLE: "green",
  OCCUPE: "orange",
  CONGE: "gray",
  ASTREINTE: "blue",
};
const STATUT_LABEL: Record<StatutTech, string> = {
  DISPONIBLE: "Disponible",
  OCCUPE: "Occupé",
  CONGE: "Congé",
  ASTREINTE: "Astreinte",
};

function TeamsPage() {
  const [q, setQ] = useState("");
  const [equipe, setEquipe] = useState("all");
  const query = q.trim().toLowerCase();
  const equipes = Array.from(new Set(TECHNICIENS.map((t) => t.equipe)));

  const filtered = TECHNICIENS.filter(
    (t) =>
      (equipe === "all" || t.equipe === equipe) &&
      (query === "" || t.nom.toLowerCase().includes(query) || t.habilitations.join(" ").toLowerCase().includes(query)),
  );
  const count = (s: StatutTech) => TECHNICIENS.filter((t) => t.statut === s).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Techniciens & habilitations</h2>
        <p className="text-sm text-slate-500">{filtered.length} techniciens · habilitations électriques B1/B2/BR…</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total" value={TECHNICIENS.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={UserCheck} label="Disponibles" value={count("DISPONIBLE")} color="bg-green-100 text-green-700" />
        <StatCard icon={ShieldCheck} label="Astreinte" value={count("ASTREINTE")} color="bg-blue-100 text-blue-700" />
        <StatCard icon={UserMinus} label="En congé" value={count("CONGE")} color="bg-slate-100 text-slate-600" />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (nom, habilitation)…"
            className="text-sm border rounded-lg bg-white pl-9 pr-3 py-2 w-64 outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <select value={equipe} onChange={(e) => setEquipe(e.target.value)} className="text-sm border rounded-lg bg-white px-3 py-2">
          <option value="all">Toutes équipes</option>
          {equipes.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Technicien</th>
              <th className="text-left px-4 py-3">Équipe</th>
              <th className="text-left px-4 py-3">Habilitations</th>
              <th className="text-center px-4 py-3">Interv./mois</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-amber-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {t.nom.split(" ").map((x) => x[0]).join("")}
                    </div>
                    <span className="font-medium text-slate-800">{t.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{t.equipe}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {t.habilitations.map((h) => (
                      <StatusBadge key={h} label={h} tone="blue" />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-700">{t.interventionsMois}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Phone size={12} /> {t.tel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={STATUT_LABEL[t.statut]} tone={STATUT_TONE[t.statut]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

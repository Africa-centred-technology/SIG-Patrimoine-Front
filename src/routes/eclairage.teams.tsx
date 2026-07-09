import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserCheck, UserMinus, ShieldCheck, Phone } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DetailModal, DetailRow } from "@/components/shared/DetailModal";
import { TECHNICIENS, INTERVENTIONS, type Technicien, type StatutTech } from "@/lib/mockEclairage";

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
const inits = (nom: string) => nom.split(" ").map((x) => x[0]).join("");

function TeamsPage() {
  const [q, setQ] = useState("");
  const [equipe, setEquipe] = useState("all");
  const [sel, setSel] = useState<Technicien | null>(null);
  const query = q.trim().toLowerCase();
  const equipes = Array.from(new Set(TECHNICIENS.map((t) => t.equipe)));

  const filtered = TECHNICIENS.filter(
    (t) =>
      (equipe === "all" || t.equipe === equipe) &&
      (query === "" || t.nom.toLowerCase().includes(query) || t.habilitations.join(" ").toLowerCase().includes(query)),
  );
  const count = (s: StatutTech) => TECHNICIENS.filter((t) => t.statut === s).length;
  const interventionsDe = (id: string) => INTERVENTIONS.filter((i) => i.technicienId === id);

  const columns: Column<Technicien>[] = [
    {
      key: "nom",
      label: "Technicien",
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{inits(t.nom)}</div>
          <span className="font-medium text-slate-800">{t.nom}</span>
        </div>
      ),
    },
    { key: "equipe", label: "Équipe", render: (t) => <span className="text-slate-600">{t.equipe}</span> },
    { key: "habilitations", label: "Habilitations", render: (t) => <div className="flex gap-1 flex-wrap">{t.habilitations.map((h) => <StatusBadge key={h} label={h} tone="blue" />)}</div> },
    { key: "interv", label: "Interv./mois", align: "center", render: (t) => <span className="font-semibold text-slate-700">{t.interventionsMois}</span> },
    { key: "tel", label: "Contact", render: (t) => <span className="inline-flex items-center gap-1 text-slate-500 text-xs"><Phone size={12} /> {t.tel}</span> },
    { key: "statut", label: "Statut", render: (t) => <StatusBadge label={STATUT_LABEL[t.statut]} tone={STATUT_TONE[t.statut]} /> },
  ];

  return (
    <div className="space-y-5">
      <ModuleHeader title="Techniciens & habilitations" subtitle={`${filtered.length} techniciens · habilitations électriques B1/B2/BR…`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total" value={TECHNICIENS.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={UserCheck} label="Disponibles" value={count("DISPONIBLE")} color="bg-green-100 text-green-700" />
        <StatCard icon={ShieldCheck} label="Astreinte" value={count("ASTREINTE")} color="bg-blue-100 text-blue-700" />
        <StatCard icon={UserMinus} label="En congé" value={count("CONGE")} color="bg-slate-100 text-slate-600" />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Rechercher (nom, habilitation)…">
        <FilterSelect value={equipe} onChange={setEquipe}>
          <option value="all">Toutes équipes</option>
          {equipes.map((e) => <option key={e}>{e}</option>)}
        </FilterSelect>
      </FilterBar>

      <DataTable columns={columns} data={filtered} rowKey={(t) => t.id} onRowClick={setSel} />

      {sel && (
        <DetailModal title={sel.nom} onClose={() => setSel(null)}>
          <DetailRow label="Équipe" value={sel.equipe} />
          <DetailRow label="Statut" value={STATUT_LABEL[sel.statut]} />
          <DetailRow label="Contact" value={sel.tel} />
          <DetailRow label="Interventions / mois" value={sel.interventionsMois} />
          <div className="pt-1">
            <div className="text-slate-500 mb-1">Habilitations</div>
            <div className="flex gap-1 flex-wrap">{sel.habilitations.map((h) => <StatusBadge key={h} label={h} tone="blue" />)}</div>
          </div>
          <div className="pt-2">
            <div className="text-slate-500 mb-1">Interventions récentes</div>
            <ul className="space-y-1">
              {interventionsDe(sel.id).slice(0, 6).map((i) => (
                <li key={i.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-md px-2 py-1.5">
                  <span className="text-slate-700">{i.reference} · {i.luminaireId}</span>
                  <span className="text-slate-400">{i.date}</span>
                </li>
              ))}
              {interventionsDe(sel.id).length === 0 && <li className="text-xs text-slate-400">Aucune intervention enregistrée.</li>}
            </ul>
          </div>
        </DetailModal>
      )}
    </div>
  );
}

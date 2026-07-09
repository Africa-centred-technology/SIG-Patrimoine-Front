import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DetailModal, DetailRow } from "@/components/shared/DetailModal";
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
  p >= 5
    ? "bg-red-100 text-red-700"
    : p >= 3
      ? "bg-orange-100 text-orange-700"
      : "bg-slate-100 text-slate-600";
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
      (query === "" ||
        t.titre.toLowerCase().includes(query) ||
        t.reference.toLowerCase().includes(query)),
  );
  const count = (s: StatutTache) => TACHES_MAINT.filter((t) => t.statut === s).length;

  const columns: Column<TacheMaint>[] = [
    {
      key: "reference",
      label: "Référence",
      render: (t) => <span className="font-medium text-slate-800">{t.reference}</span>,
    },
    {
      key: "titre",
      label: "Intervention",
      render: (t) => <span className="text-slate-700">{t.titre}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (t) => <span className="text-slate-600">{TYPE_LABEL[t.type]}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (t) => <span className="text-slate-500 text-xs">{t.date}</span>,
    },
    {
      key: "priorite",
      label: "Priorité",
      align: "center",
      render: (t) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prioColor(t.priorite)}`}>
          P{t.priorite}
        </span>
      ),
    },
    {
      key: "technicien",
      label: "Technicien",
      render: (t) => <span className="text-slate-700">{techNom(t.technicienId)}</span>,
    },
    {
      key: "statut",
      label: "Statut",
      render: (t) => <StatusBadge label={STATUT_LABEL[t.statut]} tone={STATUT_TONE[t.statut]} />,
    },
  ];

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Planification des interventions"
        subtitle={`${filtered.length} interventions · relamping, rondes, maintenance`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Calendar}
          label="Total"
          value={TACHES_MAINT.length}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Clock}
          label="Planifiées"
          value={count("PLANIFIEE")}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={PlayCircle}
          label="En cours"
          value={count("EN_COURS")}
          color="bg-orange-100 text-orange-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Terminées"
          value={count("TERMINEE")}
          color="bg-green-100 text-green-700"
        />
      </div>

      <FilterBar search={q} onSearch={setQ}>
        <FilterSelect value={type} onChange={(v) => setType(v as any)}>
          <option value="all">Tous types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={statut} onChange={(v) => setStatut(v as any)}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUT_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      <DataTable columns={columns} data={filtered} rowKey={(t) => t.id} onRowClick={setSel} />

      {sel && (
        <DetailModal title={sel.reference} onClose={() => setSel(null)}>
          <DetailRow label="Intervention" value={sel.titre} />
          <DetailRow label="Type" value={TYPE_LABEL[sel.type]} />
          <DetailRow label="Statut" value={STATUT_LABEL[sel.statut]} />
          <DetailRow label="Priorité" value={`P${sel.priorite}`} />
          <DetailRow label="Date" value={sel.date} />
          <DetailRow label="Technicien" value={techNom(sel.technicienId)} />
          <DetailRow label="Secteur" value={zoneNom(sel.zoneId)} />
          {sel.luminaireId && <DetailRow label="Luminaire" value={sel.luminaireId} />}
        </DetailModal>
      )}
    </div>
  );
}

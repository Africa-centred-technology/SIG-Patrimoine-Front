import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, CheckCircle2, PlayCircle, Timer } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DetailModal, DetailRow } from "@/components/shared/DetailModal";
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
      (query === "" ||
        i.reference.toLowerCase().includes(query) ||
        i.luminaireId.toLowerCase().includes(query)),
  );
  const terminees = INTERVENTIONS.filter((i) => i.statut === "TERMINEE").length;
  const enCours = INTERVENTIONS.filter((i) => i.statut === "EN_COURS").length;
  const dureeMoy = Math.round(
    INTERVENTIONS.reduce((s, i) => s + i.duree_min, 0) / INTERVENTIONS.length,
  );

  const columns: Column<Intervention>[] = [
    {
      key: "reference",
      label: "Référence",
      render: (i) => <span className="font-medium text-slate-800">{i.reference}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (i) => <span className="text-slate-500 text-xs">{i.date}</span>,
    },
    {
      key: "luminaireId",
      label: "Luminaire",
      render: (i) => <span className="text-slate-700">{i.luminaireId}</span>,
    },
    { key: "type", label: "Type", render: (i) => <span className="text-slate-600">{i.type}</span> },
    {
      key: "technicien",
      label: "Technicien",
      render: (i) => <span className="text-slate-700">{techNom(i.technicienId)}</span>,
    },
    {
      key: "duree",
      label: "Durée",
      align: "right",
      render: (i) => <span className="text-slate-600">{i.duree_min} min</span>,
    },
    {
      key: "statut",
      label: "Statut",
      render: (i) => (
        <StatusBadge
          label={i.statut === "TERMINEE" ? "Terminée" : "En cours"}
          tone={i.statut === "TERMINEE" ? "green" : "orange"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Suivi des interventions électriques"
        subtitle={`${filtered.length} interventions · matériel, durée, technicien`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Wrench}
          label="Total"
          value={INTERVENTIONS.length}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Terminées"
          value={terminees}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={PlayCircle}
          label="En cours"
          value={enCours}
          color="bg-orange-100 text-orange-700"
        />
        <StatCard
          icon={Timer}
          label="Durée moy."
          value={`${dureeMoy} min`}
          color="bg-sky-100 text-sky-700"
        />
      </div>

      <FilterBar search={q} onSearch={setQ}>
        <FilterSelect value={statut} onChange={(v) => setStatut(v as any)}>
          <option value="all">Tous statuts</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINEE">Terminée</option>
        </FilterSelect>
      </FilterBar>

      <DataTable columns={columns} data={filtered} rowKey={(i) => i.id} onRowClick={setSel} />

      {sel && (
        <DetailModal title={sel.reference} onClose={() => setSel(null)}>
          <DetailRow label="Date" value={sel.date} />
          <DetailRow label="Luminaire" value={sel.luminaireId} />
          <DetailRow label="Type" value={sel.type} />
          <DetailRow label="Technicien" value={techNom(sel.technicienId)} />
          <DetailRow label="Durée" value={`${sel.duree_min} min`} />
          <div className="pt-1">
            <div className="text-slate-500 mb-1">Matériel</div>
            <div className="flex flex-wrap gap-1.5">
              {sel.materiel.map((m, k) => (
                <span
                  key={k}
                  className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-20 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-[10px] text-stone-600">
              📷 Avant
            </div>
            <div className="h-20 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[10px] text-amber-700">
              📷 Après
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
}

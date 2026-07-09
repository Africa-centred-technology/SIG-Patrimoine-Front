import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bell, PlayCircle, CheckCircle2, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DetailModal, DetailRow } from "@/components/shared/DetailModal";
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

  const columns: Column<Panne>[] = [
    { key: "reference", label: "Référence", render: (p) => <span className="font-medium text-slate-800">{p.reference}</span> },
    { key: "type", label: "Type", render: (p) => <span className="text-slate-600">{TYPE_LABEL[p.type]}</span> },
    { key: "description", label: "Description", render: (p) => <span className="text-slate-500 text-xs block max-w-xs truncate">{p.description}</span> },
    { key: "urgence", label: "Urgence", align: "center", render: (p) => <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgColor(p.urgence)}`}>{p.urgence}/5</span> },
    { key: "date", label: "Date", render: (p) => <span className="text-slate-500 text-xs">{p.dateSignalement}</span> },
    { key: "statut", label: "Statut", render: (p) => <StatusBadge label={STATUT_LABEL[p.statut]} tone={TONE[p.statut]} /> },
    {
      key: "carte",
      label: "Carte",
      align: "right",
      render: (p) =>
        p.luminaireId ? (
          <span onClick={(e) => e.stopPropagation()}>
            <Link to="/eclairage/map" search={{ focus: p.luminaireId }} className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium">
              <MapPin size={14} /> Localiser
            </Link>
          </span>
        ) : null,
    },
  ];

  return (
    <div className="space-y-5">
      <ModuleHeader title="Signalements de panne" subtitle={`${filtered.length} signalements · cycle Nouveau → En cours → Résolu → Clôturé`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Bell} label="Nouveaux" value={count("NOUVEAU")} color="bg-red-100 text-red-700" />
        <StatCard icon={PlayCircle} label="En cours" value={count("EN_COURS")} color="bg-orange-100 text-orange-700" />
        <StatCard icon={CheckCircle2} label="Résolus" value={count("RESOLU")} color="bg-green-100 text-green-700" />
        <StatCard icon={AlertTriangle} label="Total" value={PANNES.length} color="bg-amber-100 text-amber-700" />
      </div>

      <FilterBar search={q} onSearch={setQ}>
        <FilterSelect value={statut} onChange={(v) => setStatut(v as any)}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </FilterSelect>
        <FilterSelect value={type} onChange={(v) => setType(v as any)}>
          <option value="all">Tous types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </FilterSelect>
      </FilterBar>

      <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} onRowClick={setSel} />

      {sel && (
        <DetailModal title={sel.reference} onClose={() => setSel(null)}>
          <DetailRow label="Type" value={TYPE_LABEL[sel.type]} />
          <DetailRow label="Statut" value={STATUT_LABEL[sel.statut]} />
          <DetailRow label="Urgence" value={`${sel.urgence}/5`} />
          <DetailRow label="Date" value={sel.dateSignalement} />
          <DetailRow label="Secteur" value={zoneNom(sel.zoneId)} />
          {sel.luminaireId && <DetailRow label="Luminaire" value={sel.luminaireId} />}
          <div className="pt-2">
            <div className="text-slate-500 mb-1">Description</div>
            <div className="text-slate-800">{sel.description}</div>
          </div>
          {sel.luminaireId && (
            <Link to="/eclairage/map" search={{ focus: sel.luminaireId }} className="mt-3 inline-flex items-center gap-1.5 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg px-3 py-2 font-medium">
              <MapPin size={15} /> Localiser sur la carte
            </Link>
          )}
        </DetailModal>
      )}
    </div>
  );
}

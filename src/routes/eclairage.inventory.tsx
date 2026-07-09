import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, Power, WrenchIcon, Leaf, AlertTriangle, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DetailModal, DetailRow } from "@/components/shared/DetailModal";
import { LUMINAIRES, ZONES } from "@/lib/mockData";
import type { Luminaire, EtatLuminaire, TypeLuminaire } from "@/lib/types";

export const Route = createFileRoute("/eclairage/inventory")({ component: InventoryPage });

const TYPE_COLOR: Record<TypeLuminaire, string> = {
  LED: "amber",
  SODIUM: "orange",
  PROJECTEUR: "amber",
  BORNE: "amber",
  APPLIQUE: "amber",
  GUIRLANDE: "blue",
} as any;
const ETAT_TONE: Record<EtatLuminaire, "green" | "gray" | "red" | "orange" | "amber"> = {
  ALLUME: "green",
  ETEINT: "gray",
  EN_PANNE: "red",
  MAINTENANCE: "orange",
  VETUSTE: "amber",
};
const zoneNom = (id: string) => ZONES.find((z) => z.id === id)?.nom ?? id;

function InventoryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | TypeLuminaire>("all");
  const [etat, setEtat] = useState<"all" | EtatLuminaire>("all");
  const [zone, setZone] = useState("all");
  const [sel, setSel] = useState<Luminaire | null>(null);
  const query = q.trim().toLowerCase();

  const filtered = LUMINAIRES.filter(
    (l) =>
      (type === "all" || l.type === type) &&
      (etat === "all" || l.etat === etat) &&
      (zone === "all" || l.site_id === zone) &&
      (query === "" ||
        l.reference.toLowerCase().includes(query) ||
        l.type.toLowerCase().includes(query)),
  );

  const columns: Column<Luminaire>[] = [
    {
      key: "reference",
      label: "Référence",
      render: (l) => <span className="font-medium text-slate-800">{l.reference}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (l) => <StatusBadge label={l.type} tone={TYPE_COLOR[l.type] as any} />,
    },
    {
      key: "puissance",
      label: "Puissance",
      align: "right",
      render: (l) => <span>{l.puissance_w} W</span>,
    },
    {
      key: "etat",
      label: "État",
      render: (l) => <StatusBadge label={l.etat} tone={ETAT_TONE[l.etat]} />,
    },
    {
      key: "secteur",
      label: "Secteur",
      render: (l) => <span className="text-slate-700">{zoneNom(l.site_id)}</span>,
    },
    {
      key: "date_pose",
      label: "Date pose",
      render: (l) => <span className="text-slate-500 text-xs">{l.date_pose}</span>,
    },
    {
      key: "carte",
      label: "Carte",
      align: "right",
      render: (l) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Link
            to="/eclairage/map"
            search={{ focus: l.id }}
            className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium"
          >
            <MapPin size={14} /> Localiser
          </Link>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Inventaire des luminaires"
        subtitle={`${filtered.length} luminaires · vue tabulaire unifiée`}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          icon={Lightbulb}
          label="Total"
          value={LUMINAIRES.length}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Power}
          label="Allumés"
          value={LUMINAIRES.filter((l) => l.etat === "ALLUME").length}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={AlertTriangle}
          label="En panne"
          value={LUMINAIRES.filter((l) => l.etat === "EN_PANNE").length}
          color="bg-red-100 text-red-700"
        />
        <StatCard
          icon={Leaf}
          label="LED"
          value={LUMINAIRES.filter((l) => l.type === "LED").length}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={WrenchIcon}
          label="Vétustes"
          value={LUMINAIRES.filter((l) => l.etat === "VETUSTE").length}
          color="bg-amber-100 text-amber-800"
        />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Rechercher (réf., type)…">
        <FilterSelect value={type} onChange={(v) => setType(v as any)}>
          <option value="all">Tous types</option>
          {(
            ["LED", "SODIUM", "PROJECTEUR", "BORNE", "APPLIQUE", "GUIRLANDE"] as TypeLuminaire[]
          ).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={etat} onChange={(v) => setEtat(v as any)}>
          <option value="all">Tous états</option>
          {(["ALLUME", "ETEINT", "EN_PANNE", "MAINTENANCE", "VETUSTE"] as EtatLuminaire[]).map(
            (t) => (
              <option key={t}>{t}</option>
            ),
          )}
        </FilterSelect>
        <FilterSelect value={zone} onChange={setZone}>
          <option value="all">Tous secteurs</option>
          {ZONES.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nom}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      <DataTable columns={columns} data={filtered} rowKey={(l) => l.id} onRowClick={setSel} />

      {sel && (
        <DetailModal title={sel.reference} onClose={() => setSel(null)}>
          <DetailRow label="Type" value={sel.type} />
          <DetailRow label="Puissance" value={`${sel.puissance_w} W`} />
          <DetailRow label="État" value={sel.etat} />
          {sel.hauteur_feu_m && (
            <DetailRow label="Hauteur de feu" value={`${sel.hauteur_feu_m} m`} />
          )}
          {sel.temperature_couleur_k && (
            <DetailRow label="Température" value={`${sel.temperature_couleur_k} K`} />
          )}
          <DetailRow label="Secteur" value={zoneNom(sel.site_id)} />
          {sel.date_pose && <DetailRow label="Date de pose" value={sel.date_pose} />}
          <Link
            to="/eclairage/map"
            search={{ focus: sel.id }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg px-3 py-2 font-medium"
          >
            <MapPin size={15} /> Localiser sur la carte
          </Link>
        </DetailModal>
      )}
    </div>
  );
}

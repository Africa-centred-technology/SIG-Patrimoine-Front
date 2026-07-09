import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar as CalIcon, Clock, PlayCircle, CheckCircle2, CalendarDays, List } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
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
import "react-big-calendar/lib/css/react-big-calendar.css";

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
const STATUT_COLOR: Record<StatutTache, string> = {
  PLANIFIEE: "#3b82f6",
  EN_COURS: "#f97316",
  TERMINEE: "#22c55e",
};
const prioColor = (p: number) =>
  p >= 5 ? "bg-red-100 text-red-700" : p >= 3 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600";
const zoneNom = (id: string) => ZONES.find((z) => z.id === id)?.nom ?? id;

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
  getDay,
  locales: { fr },
});

interface CalEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: TacheMaint;
}

function PlanningPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | TypeTacheMaint>("all");
  const [statut, setStatut] = useState<"all" | StatutTache>("all");
  const [sel, setSel] = useState<TacheMaint | null>(null);
  const [vue, setVue] = useState<"cal" | "list">("cal");
  const [calView, setCalView] = useState<View>("month");
  const query = q.trim().toLowerCase();

  const filtered = TACHES_MAINT.filter(
    (t) =>
      (type === "all" || t.type === type) &&
      (statut === "all" || t.statut === statut) &&
      (query === "" || t.titre.toLowerCase().includes(query) || t.reference.toLowerCase().includes(query)),
  );
  const count = (s: StatutTache) => TACHES_MAINT.filter((t) => t.statut === s).length;

  const events: CalEvent[] = filtered.map((t) => {
    const d = new Date(t.date + "T09:00:00");
    return { title: `${TYPE_LABEL[t.type]} — ${zoneNom(t.zoneId)}`, start: d, end: d, allDay: true, resource: t };
  });

  const columns: Column<TacheMaint>[] = [
    { key: "reference", label: "Référence", render: (t) => <span className="font-medium text-slate-800">{t.reference}</span> },
    { key: "titre", label: "Intervention", render: (t) => <span className="text-slate-700">{t.titre}</span> },
    { key: "type", label: "Type", render: (t) => <span className="text-slate-600">{TYPE_LABEL[t.type]}</span> },
    { key: "date", label: "Date", render: (t) => <span className="text-slate-500 text-xs">{t.date}</span> },
    { key: "priorite", label: "Priorité", align: "center", render: (t) => <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prioColor(t.priorite)}`}>P{t.priorite}</span> },
    { key: "technicien", label: "Technicien", render: (t) => <span className="text-slate-700">{techNom(t.technicienId)}</span> },
    { key: "statut", label: "Statut", render: (t) => <StatusBadge label={STATUT_LABEL[t.statut]} tone={STATUT_TONE[t.statut]} /> },
  ];

  const toggle = (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      <button onClick={() => setVue("cal")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${vue === "cal" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>
        <CalendarDays size={15} /> Calendrier
      </button>
      <button onClick={() => setVue("list")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${vue === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>
        <List size={15} /> Liste
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <ModuleHeader title="Planification des interventions" subtitle={`${filtered.length} interventions · relamping, rondes, maintenance`} actions={toggle} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalIcon} label="Total" value={TACHES_MAINT.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Clock} label="Planifiées" value={count("PLANIFIEE")} color="bg-blue-100 text-blue-700" />
        <StatCard icon={PlayCircle} label="En cours" value={count("EN_COURS")} color="bg-orange-100 text-orange-700" />
        <StatCard icon={CheckCircle2} label="Terminées" value={count("TERMINEE")} color="bg-green-100 text-green-700" />
      </div>

      <FilterBar search={q} onSearch={setQ}>
        <FilterSelect value={type} onChange={(v) => setType(v as any)}>
          <option value="all">Tous types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </FilterSelect>
        <FilterSelect value={statut} onChange={(v) => setStatut(v as any)}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </FilterSelect>
      </FilterBar>

      {vue === "cal" ? (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div style={{ height: 620 }}>
            <BigCalendar
              localizer={localizer}
              culture="fr"
              events={events}
              defaultDate={new Date(2026, 6, 15)}
              view={calView}
              onView={setCalView}
              views={["month", "week", "day", "agenda"]}
              popup
              onSelectEvent={(e: CalEvent) => setSel(e.resource)}
              eventPropGetter={(e: CalEvent) => ({
                style: { backgroundColor: STATUT_COLOR[e.resource.statut], border: "none", borderRadius: 6, fontSize: 12 },
              })}
              messages={{
                today: "Aujourd'hui",
                previous: "Précédent",
                next: "Suivant",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                noEventsInRange: "Aucune intervention sur cette période.",
              }}
            />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(t) => t.id} onRowClick={setSel} />
      )}

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

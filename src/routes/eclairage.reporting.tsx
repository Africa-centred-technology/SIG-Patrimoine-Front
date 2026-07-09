import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Zap, Coins, Leaf, Gauge } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { StatCard } from "@/components/shared/StatCard";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { LUMINAIRES, ZONES, CONSO_ENERGIE } from "@/lib/mockData";
import {
  consoTotaleMois,
  coutMAD,
  tauxLED,
  puissanceInstallee,
  economieVsSodium,
  co2Evite,
  consoParMois,
} from "@/lib/eclairage";

export const Route = createFileRoute("/eclairage/reporting")({ component: ReportingPage });

const COLORS = ["#f59e0b", "#f97316", "#eab308", "#fbbf24", "#fcd34d", "#a78bfa"];

function ReportingPage() {
  const conso = consoTotaleMois(LUMINAIRES);
  const eco = economieVsSodium(LUMINAIRES);
  const consoData = consoParMois(CONSO_ENERGIE, ZONES);
  const parType = ["LED", "SODIUM", "PROJECTEUR", "BORNE", "APPLIQUE", "GUIRLANDE"]
    .map((t) => ({
      name: t,
      value: LUMINAIRES.filter((l) => l.type === t).length,
    }))
    .filter((d) => d.value > 0);

  const rapports = [
    { titre: "Rapport mensuel — Juin 2026", type: "Mensuel", pages: 24 },
    { titre: "Bilan carbone T2 2026", type: "Trimestriel", pages: 12 },
    { titre: "Rapport pannes — Semaine 27", type: "Hebdomadaire", pages: 6 },
    { titre: "Bilan énergétique annuel 2025", type: "Annuel", pages: 48 },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader closeTo="/eclairage/map"
        title="Rapports & performance énergétique"
        subtitle="Consommation, coûts, taux LED, économies et bilan carbone"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Zap}
          label="Conso / mois"
          value={`${conso.toFixed(0)} kWh`}
          color="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={Coins}
          label="Coût / mois"
          value={`${coutMAD(conso).toLocaleString("fr-FR")} MAD`}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Gauge}
          label="Taux LED"
          value={`${(tauxLED(LUMINAIRES) * 100).toFixed(0)}%`}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={Leaf}
          label="CO₂ évité / mois"
          value={`${co2Evite(eco).toFixed(0)} kg`}
          color="bg-green-100 text-green-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Consommation mensuelle (kWh)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={consoData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Répartition des luminaires par type</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={parType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {parType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Coût mensuel estimé (MAD)</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={consoData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cout" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Rapports disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rapports.map((r) => (
            <div key={r.titre} className="bg-white rounded-xl border p-5 shadow-sm">
              <FileText className="text-amber-500 mb-2" />
              <div className="font-semibold text-slate-900 text-sm">{r.titre}</div>
              <div className="text-xs text-slate-500 mt-1">
                {r.type} · {r.pages} pages
              </div>
              <div className="mt-4 flex gap-2">
                <button className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-white flex items-center gap-1">
                  <Download size={12} /> PDF
                </button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center gap-1">
                  <Download size={12} /> Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

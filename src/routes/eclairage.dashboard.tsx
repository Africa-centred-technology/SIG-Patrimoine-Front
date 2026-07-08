import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, AlertTriangle, Zap, Gauge, Percent, Bell } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LUMINAIRES, PANNES, ZONES, CONSO_ENERGIE } from "@/lib/mockData";
import { consoTotaleMois, coutMAD, tauxPanne, tauxLED, puissanceInstallee, pannesOuvertes, consoParMois } from "@/lib/eclairage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";

export const Route = createFileRoute("/eclairage/dashboard")({ component: DashboardEclairage });

function DashboardEclairage() {
  const conso = consoTotaleMois(LUMINAIRES);
  const tp = tauxPanne(LUMINAIRES);
  const tl = tauxLED(LUMINAIRES);
  const puiss = puissanceInstallee(LUMINAIRES);
  const ouv = pannesOuvertes(PANNES);
  const consoData = consoParMois(CONSO_ENERGIE, ZONES);

  const parType = ["LED", "SODIUM", "PROJECTEUR", "BORNE", "APPLIQUE", "GUIRLANDE"].map((t) => ({
    name: t,
    value: LUMINAIRES.filter((l) => l.type === t).length,
  }));
  const COLORS = ["#f59e0b", "#f97316", "#eab308", "#fbbf24", "#fcd34d", "#a78bfa"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Lightbulb} label="Points lumineux" value={LUMINAIRES.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={AlertTriangle} label="% en panne" value={`${(tp * 100).toFixed(1)}%`} color="bg-red-100 text-red-700" />
        <StatCard icon={Zap} label="Conso / mois" value={`${conso.toFixed(0)} kWh`} hint={`${coutMAD(conso).toLocaleString("fr-FR")} MAD`} color="bg-sky-100 text-sky-700" />
        <StatCard icon={Gauge} label="Puissance installée" value={`${puiss.toFixed(1)} kW`} color="bg-stone-100 text-stone-700" />
        <StatCard icon={Percent} label="Taux LED" value={`${(tl * 100).toFixed(0)}%`} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Bell} label="Signalements ouverts" value={ouv.length} color="bg-orange-100 text-orange-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Consommation énergétique (12 mois)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={consoData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Répartition par type</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={parType} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={2}>
                  {parType.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Pannes par secteur</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={ZONES.map(z => ({ zone: z.nom.split(" ").slice(0, 2).join(" "), pannes: PANNES.filter(p => p.zoneId === z.id && (p.statut === "NOUVEAU" || p.statut === "EN_COURS")).length }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="pannes" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Dernières pannes signalées</h3>
          <ul className="space-y-2 text-sm">
            {ouv.slice(0, 6).map(p => (
              <li key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <div className="font-medium text-slate-800">{p.reference}</div>
                  <div className="text-xs text-slate-500">{p.description}</div>
                </div>
                <StatusBadge label={p.statut} tone={p.statut === "NOUVEAU" ? "red" : "orange"} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

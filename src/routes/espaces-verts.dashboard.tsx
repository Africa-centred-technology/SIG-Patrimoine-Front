import { createFileRoute } from "@tanstack/react-router";
import { Trees, Sprout, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EV_OBJETS } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/espaces-verts/dashboard")({ component: DashEV });

function DashEV() {
  const parType = Object.entries(
    EV_OBJETS.reduce<Record<string, number>>((acc, o) => { acc[o.type] = (acc[o.type] ?? 0) + 1; return acc; }, {}),
  ).map(([type, n]) => ({ type, n }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trees} label="Objets inventoriés" value={EV_OBJETS.length} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Sprout} label="Tâches ce mois" value={42} color="bg-lime-100 text-lime-700" />
        <StatCard icon={AlertTriangle} label="Réclamations ouvertes" value={7} color="bg-red-100 text-red-700" />
        <StatCard icon={CheckCircle2} label="Taux réalisation" value="87%" color="bg-green-100 text-green-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Répartition du patrimoine</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={parType}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="n" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Tâches récentes</h3>
          <ul className="text-sm divide-y">
            {[
              { t: "Taille arbre — Parc central", s: "TERMINEE", tone: "green" },
              { t: "Arrosage — Jardin sec", s: "EN_COURS", tone: "orange" },
              { t: "Traitement phyto — Avenue MVI", s: "PLANIFIEE", tone: "blue" },
              { t: "Tonte gazon — Parc central", s: "PLANIFIEE", tone: "blue" },
            ].map((x, i) => (
              <li key={i} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{x.t}</span>
                <StatusBadge label={x.s} tone={x.tone as any} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

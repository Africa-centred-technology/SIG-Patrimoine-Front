import { createFileRoute } from "@tanstack/react-router";
import { Zap, Leaf, TrendingDown, AlertOctagon } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { LUMINAIRES, ZONES, CONSO_ENERGIE } from "@/lib/mockData";
import {
  consoTotaleMois, coutMAD, economieVsSodium, co2Evite, tauxLED,
  consoParMois, detecteAnomalies,
} from "@/lib/eclairage";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/eclairage/energie")({ component: EnergiePage });

function EnergiePage() {
  const conso = consoTotaleMois(LUMINAIRES);
  const eco = economieVsSodium(LUMINAIRES);
  const co2 = co2Evite(eco);
  const tl = tauxLED(LUMINAIRES);
  const data = consoParMois(CONSO_ENERGIE, ZONES);
  const anomalies = detecteAnomalies(LUMINAIRES, new Date("2026-07-08T12:00:00"));

  const parSecteur = ZONES.map(z => {
    const lumZ = LUMINAIRES.filter(l => l.site_id === z.id);
    return {
      zone: z.nom.split(" ").slice(0, 2).join(" "),
      kWh: Math.round(consoTotaleMois(lumZ)),
      cout: Math.round(coutMAD(consoTotaleMois(lumZ))),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Énergie & performance</h2>
        <p className="text-sm text-slate-500">Consommation, taux LED, économies vs référence tout-sodium, bilan carbone.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Conso mensuelle" value={`${conso.toFixed(0)} kWh`} hint={`${coutMAD(conso).toLocaleString("fr-FR")} MAD/mois`} color="bg-amber-100 text-amber-700" />
        <StatCard icon={TrendingDown} label="Économie vs sodium" value={`${eco.toFixed(0)} kWh`} hint={`${coutMAD(eco).toLocaleString("fr-FR")} MAD/mois économisés`} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Leaf} label="CO₂ évité" value={`${co2.toFixed(0)} kg`} hint="Bilan carbone mensuel" color="bg-green-100 text-green-700" />
        <StatCard icon={AlertOctagon} label="Anomalies" value={anomalies.length} hint="Allumés en journée" color="bg-red-100 text-red-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Consommation annuelle (kWh & coût)</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="l" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="l" type="monotone" dataKey="kWh" stroke="#f59e0b" strokeWidth={2.5} />
                <Line yAxisId="r" type="monotone" dataKey="cout" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Conso par secteur (mois courant)</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={parSecteur}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="kWh" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Comparatif LED vs référence tout-sodium</h3>
          <div className="text-sm text-slate-500">Taux LED : <strong className="text-emerald-700">{(tl * 100).toFixed(0)}%</strong></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
            <div className="text-xs uppercase text-amber-700 font-semibold">Consommation actuelle</div>
            <div className="text-3xl font-bold text-amber-900 mt-1">{conso.toFixed(0)} kWh</div>
            <div className="text-sm text-amber-800 mt-1">{coutMAD(conso).toLocaleString("fr-FR")} MAD / mois</div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
            <div className="text-xs uppercase text-emerald-700 font-semibold">Économie & impact</div>
            <div className="text-3xl font-bold text-emerald-900 mt-1">−{eco.toFixed(0)} kWh</div>
            <div className="text-sm text-emerald-800 mt-1">≈ {co2.toFixed(0)} kg CO₂ évités · {coutMAD(eco).toLocaleString("fr-FR")} MAD économisés</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Package, KeyRound, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useApp } from "@/contexts/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/platform/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { tenants, licences } = useApp();
  const actives = licences.filter((l) => l.statut === "ACTIVE").length;
  const essais = licences.filter((l) => l.statut === "ESSAI").length;
  const expirees = licences.filter((l) => l.statut === "EXPIREE" || l.statut === "SUSPENDUE").length;
  const mrr = licences.filter((l) => l.statut === "ACTIVE").reduce((s, l) => s + l.prixMensuelMAD, 0);

  const parVille = Object.entries(
    tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.ville] = (acc[t.ville] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([ville, n]) => ({ ville, n }));

  const parProduit = [
    { name: "Espaces Verts", value: tenants.filter((t) => t.produits.includes("ESPACES_VERTS")).length, color: "#059669" },
    { name: "Éclairage", value: tenants.filter((t) => t.produits.includes("ECLAIRAGE")).length, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Organisations" value={tenants.length} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={Package} label="Produits actifs" value={licences.filter(l => l.statut === "ACTIVE" || l.statut === "ESSAI").length} color="bg-violet-100 text-violet-700" />
        <StatCard icon={KeyRound} label="Licences" value={`${actives} actives`} hint={`${essais} en essai · ${expirees} expirées`} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={TrendingUp} label="MRR (MAD)" value={mrr.toLocaleString("fr-FR")} hint="Revenu récurrent mensuel" color="bg-amber-100 text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Organisations par ville</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={parVille}>
                <XAxis dataKey="ville" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="n" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Répartition produits</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={parProduit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {parProduit.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4">Alertes & actions rapides</h2>
        <ul className="space-y-2 text-sm">
          {licences.filter(l => l.statut === "EXPIREE").map(l => {
            const t = tenants.find(x => x.id === l.tenantId);
            return (
              <li key={l.id} className="flex items-center justify-between rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                <span className="flex items-center gap-2 text-red-700"><AlertCircle size={16} /> Licence expirée — {t?.nom} ({l.produit})</span>
                <Link to="/platform/tenants/$id" params={{ id: l.tenantId }} className="text-red-700 font-medium hover:underline">Voir</Link>
              </li>
            );
          })}
          {licences.filter(l => l.statut === "ESSAI").map(l => {
            const t = tenants.find(x => x.id === l.tenantId);
            return (
              <li key={l.id} className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <span className="flex items-center gap-2 text-amber-800"><CheckCircle2 size={16} /> Essai en cours — {t?.nom} ({l.produit})</span>
                <Link to="/platform/tenants/$id" params={{ id: l.tenantId }} className="text-amber-800 font-medium hover:underline">Voir</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

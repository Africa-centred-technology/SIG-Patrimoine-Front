import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApp } from "@/contexts/AppContext";

export const Route = createFileRoute("/platform/licences")({
  component: LicencesPage,
});

function LicencesPage() {
  const { licences, tenants } = useApp();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Toutes les licences</h2>
        <p className="text-sm text-slate-500">{licences.length} licences · {licences.filter(l => l.statut === "ACTIVE").length} actives</p>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Organisation</th>
              <th className="text-left px-4 py-3">Produit</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Sièges</th>
              <th className="text-left px-4 py-3">Expiration</th>
              <th className="text-right px-4 py-3">MAD/mois</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {licences.map(l => {
              const t = tenants.find(x => x.id === l.tenantId);
              return (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to="/platform/tenants/$id" params={{ id: l.tenantId }} className="text-indigo-600 hover:underline font-medium">{t?.nom}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={l.produit === "ESPACES_VERTS" ? "Espaces Verts" : "Éclairage"} tone={l.produit === "ESPACES_VERTS" ? "emerald" : "amber"} />
                  </td>
                  <td className="px-4 py-3 font-medium">{l.plan}</td>
                  <td className="px-4 py-3"><StatusBadge label={l.statut} tone={l.statut === "ACTIVE" ? "green" : l.statut === "ESSAI" ? "amber" : l.statut === "SUSPENDUE" ? "orange" : "red"} /></td>
                  <td className="px-4 py-3 text-right">{l.seatsUtilises}/{l.seats}</td>
                  <td className="px-4 py-3">{l.dateFin}</td>
                  <td className="px-4 py-3 text-right font-semibold">{l.prixMensuelMAD.toLocaleString("fr-FR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

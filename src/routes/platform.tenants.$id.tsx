import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Users, MapPin, Package, Play, Pause, Trash2, RefreshCw, Plus, X, Mail } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApp, useTenant, useLicencesFor } from "@/contexts/AppContext";
import type { PlanLicence, ProduitCle, Licence } from "@/lib/types";

export const Route = createFileRoute("/platform/tenants/$id")({
  component: TenantDetail,
});

function TenantDetail() {
  const { id } = Route.useParams();
  const tenant = useTenant(id);
  const licences = useLicencesFor(id);
  const { impersonate, attribuerLicence, suspendreLicence, reactiverLicence, revoquerLicence, changerPlan } = useApp();
  const navigate = useNavigate();
  const [attribModal, setAttribModal] = useState<ProduitCle | null>(null);

  if (!tenant) return <div>Introuvable. <Link to="/platform/tenants">Retour</Link></div>;

  const enterSpace = (produit: ProduitCle) => {
    impersonate(tenant.id, produit);
    navigate({ to: produit === "ESPACES_VERTS" ? "/espaces-verts/dashboard" : "/eclairage/dashboard" });
  };

  const missingProducts: ProduitCle[] = (["ESPACES_VERTS", "ECLAIRAGE"] as ProduitCle[]).filter(
    (p) => !licences.some((l) => l.produit === p),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/platform/tenants" className="hover:text-slate-900">Organisations</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{tenant.nom}</span>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
              {tenant.nom.split(" ").slice(0, 2).map(s => s[0]).join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{tenant.nom}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin size={14} /> {tenant.ville}</span>
                <span className="inline-flex items-center gap-1"><Mail size={14} /> {tenant.contactEmail}</span>
              </div>
            </div>
          </div>
          <div>
            {tenant.statut === "ACTIF" && <StatusBadge label="Actif" tone="green" />}
            {tenant.statut === "EN_ATTENTE" && <StatusBadge label="En attente" tone="amber" />}
            {tenant.statut === "SUSPENDU" && <StatusBadge label="Suspendu" tone="red" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Utilisateurs" value={tenant.nbUtilisateurs} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={Building2} label="Sites" value={tenant.nbSites} color="bg-slate-100 text-slate-700" />
        <StatCard icon={Package} label="Produits" value={tenant.produits.length} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={RefreshCw} label="Licences" value={licences.length} color="bg-amber-100 text-amber-700" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Produits & Licences</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licences.map((l) => (
            <LicenceCard key={l.id} l={l} onEnter={() => enterSpace(l.produit)} onSuspend={() => suspendreLicence(l.id)} onReactivate={() => reactiverLicence(l.id)} onRevoke={() => revoquerLicence(l.id)} onChangePlan={(p) => changerPlan(l.id, p)} />
          ))}
          {missingProducts.map((p) => (
            <div key={p} className="rounded-xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center bg-white">
              <Package className="text-slate-400 mb-2" />
              <div className="text-sm text-slate-600 mb-3">Produit non attribué : <strong>{p === "ESPACES_VERTS" ? "Espaces Verts" : "Green Éclairage"}</strong></div>
              <button
                onClick={() => setAttribModal(p)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-600/20"
              >
                <Plus size={14} /> Attribuer
              </button>
            </div>
          ))}
        </div>
      </div>

      {attribModal && (
        <AttribModal
          produit={attribModal}
          onClose={() => setAttribModal(null)}
          onSubmit={(plan, seats, dureeM) => { attribuerLicence(tenant.id, attribModal, plan, seats, dureeM); setAttribModal(null); }}
        />
      )}
    </div>
  );
}

function LicenceCard({ l, onEnter, onSuspend, onReactivate, onRevoke, onChangePlan }: {
  l: Licence;
  onEnter: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onRevoke: () => void;
  onChangePlan: (p: PlanLicence) => void;
}) {
  const isEV = l.produit === "ESPACES_VERTS";
  const tone = isEV ? "emerald" : "amber";
  const active = l.statut === "ACTIVE" || l.statut === "ESSAI";
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className={`px-5 py-4 ${isEV ? "bg-emerald-50" : "bg-amber-50"} border-b flex items-center justify-between`}>
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wide ${isEV ? "text-emerald-700" : "text-amber-700"}`}>{isEV ? "Espaces Verts" : "Green Éclairage"}</div>
          <div className="text-lg font-bold text-slate-900">{l.plan}</div>
        </div>
        <StatusBadge label={l.statut} tone={l.statut === "ACTIVE" ? "green" : l.statut === "ESSAI" ? "amber" : l.statut === "SUSPENDUE" ? "orange" : "red"} />
      </div>
      <div className="p-5 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Sièges</span><span className="font-medium">{l.seatsUtilises}/{l.seats}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Début</span><span>{l.dateDebut}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Fin</span><span>{l.dateFin}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Prix</span><span className="font-semibold">{l.prixMensuelMAD.toLocaleString("fr-FR")} MAD/mois</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Renouv. auto</span><span>{l.renouvellementAuto ? "Oui" : "Non"}</span></div>

        <div className="pt-3 border-t space-y-2">
          <button
            onClick={onEnter}
            disabled={!active}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${active ? (isEV ? "bg-emerald-700 hover:bg-emerald-800 text-white" : "bg-amber-500 hover:bg-amber-600 text-white") : "bg-slate-100 text-slate-400"}`}
          >
            <Play size={14} /> Accéder à l'espace <ArrowRight size={14} />
          </button>
          <div className="flex gap-2">
            <select
              value={l.plan}
              onChange={(e) => onChangePlan(e.target.value as PlanLicence)}
              className="text-xs border rounded-md px-2 py-1.5 bg-slate-50 flex-1"
            >
              <option>STARTER</option>
              <option>PRO</option>
              <option>ENTERPRISE</option>
            </select>
            {l.statut === "SUSPENDUE" ? (
              <button onClick={onReactivate} className="text-xs px-2 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 inline-flex items-center gap-1"><Play size={12} /> Réactiver</button>
            ) : (
              <button onClick={onSuspend} className="text-xs px-2 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 inline-flex items-center gap-1"><Pause size={12} /> Suspendre</button>
            )}
            <button onClick={onRevoke} className="text-xs px-2 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center gap-1"><Trash2 size={12} /> Révoquer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttribModal({ produit, onClose, onSubmit }: {
  produit: ProduitCle;
  onClose: () => void;
  onSubmit: (plan: PlanLicence, seats: number, dureeM: number) => void;
}) {
  const [plan, setPlan] = useState<PlanLicence>("PRO");
  const [seats, setSeats] = useState(25);
  const [dureeM, setDureeM] = useState(12);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-slate-900">Attribuer — {produit === "ESPACES_VERTS" ? "Espaces Verts" : "Green Éclairage"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(plan, seats, dureeM); }} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-700">Plan</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value as PlanLicence)} className="mt-1 w-full border rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <option value="STARTER">Starter (essai 30j — 5 sièges — 0 MAD)</option>
              <option value="PRO">Pro (25 sièges — 4 900 MAD/mois)</option>
              <option value="ENTERPRISE">Enterprise (illimité — sur devis)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">Sièges</label>
              <input type="number" value={seats} onChange={e => setSeats(+e.target.value)} className="mt-1 w-full border rounded-lg bg-slate-50 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">Durée (mois)</label>
              <input type="number" value={dureeM} onChange={e => setDureeM(+e.target.value)} className="mt-1 w-full border rounded-lg bg-slate-50 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-600/20">Créer la licence</button>
          </div>
        </form>
      </div>
    </div>
  );
}

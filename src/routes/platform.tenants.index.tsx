import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApp } from "@/contexts/AppContext";
import type { PlanLicence, ProduitCle } from "@/lib/types";

export const Route = createFileRoute("/platform/tenants/")({
  component: TenantsList,
});

function TenantsList() {
  const { tenants, licences, createTenant } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Organisations</h2>
          <p className="text-sm text-slate-500">Gérez les tenants et leurs licences.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-[0.98]"
        >
          <Plus size={16} /> Créer une organisation
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Ville</th>
              <th className="text-left px-4 py-3">Produits</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Utilisateurs</th>
              <th className="text-right px-4 py-3">Sites</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => {
              const lics = licences.filter(l => l.tenantId === t.id);
              const anyExpired = lics.some(l => l.statut === "EXPIREE");
              return (
                <tr key={t.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <Link to="/platform/tenants/$id" params={{ id: t.id }} className="font-medium text-slate-900 hover:text-indigo-600">
                      {t.nom}
                    </Link>
                    <div className="text-xs text-slate-500">{t.contactNom} · {t.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.ville}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {t.produits.includes("ESPACES_VERTS") && <StatusBadge label="Espaces Verts" tone="emerald" />}
                      {t.produits.includes("ECLAIRAGE") && <StatusBadge label="Éclairage" tone="amber" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {t.statut === "ACTIF" && <StatusBadge label={anyExpired ? "Licence expirée" : "Actif"} tone={anyExpired ? "red" : "green"} />}
                    {t.statut === "EN_ATTENTE" && <StatusBadge label="En attente" tone="amber" />}
                    {t.statut === "SUSPENDU" && <StatusBadge label="Suspendu" tone="red" />}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{t.nbUtilisateurs}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{t.nbSites}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {open && <CreateTenantModal onClose={() => setOpen(false)} onCreate={createTenant} />}
    </div>
  );
}

function CreateTenantModal({ onClose, onCreate }: { onClose: () => void; onCreate: ReturnType<typeof useApp>["createTenant"] }) {
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [contactNom, setContactNom] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [produits, setProduits] = useState<ProduitCle[]>(["ESPACES_VERTS"]);
  const [plan, setPlan] = useState<PlanLicence>("PRO");

  const toggle = (p: ProduitCle) =>
    setProduits((prev) => (prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(
      { nom, slug: nom.toLowerCase().replace(/\s+/g, "-"), statut: "ACTIF", produits, contactNom, contactEmail, ville },
      produits,
      plan,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-slate-900">Créer une organisation</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <Field label="Nom de l'organisation">
            <input required value={nom} onChange={e => setNom(e.target.value)} className="input" placeholder="Commune de …" />
          </Field>
          <Field label="Ville">
            <input required value={ville} onChange={e => setVille(e.target.value)} className="input" placeholder="Benguérir" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact"><input required value={contactNom} onChange={e => setContactNom(e.target.value)} className="input" /></Field>
            <Field label="Email"><input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="input" /></Field>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wide">Produits à attribuer</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["ESPACES_VERTS", "ECLAIRAGE"] as ProduitCle[]).map(p => (
                <label key={p} className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer ${produits.includes(p) ? "border-indigo-500 bg-indigo-50" : "border-slate-200"}`}>
                  <input type="checkbox" checked={produits.includes(p)} onChange={() => toggle(p)} />
                  <span className="text-sm font-medium">{p === "ESPACES_VERTS" ? "Espaces Verts" : "Éclairage"}</span>
                </label>
              ))}
            </div>
          </div>
          <Field label="Plan">
            <select value={plan} onChange={e => setPlan(e.target.value as PlanLicence)} className="input">
              <option value="STARTER">Starter (essai 30j)</option>
              <option value="PRO">Pro — 4 900 MAD/mois</option>
              <option value="ENTERPRISE">Enterprise — sur devis</option>
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button
              type="submit"
              disabled={produits.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              Créer & attribuer
            </button>
          </div>
        </form>
      </div>
      <style>{`.input { width:100%; padding:0.55rem 0.75rem; border:1px solid rgb(226 232 240); background: rgb(248 250 252); border-radius:0.5rem; font-size:0.875rem; outline:none; } .input:focus { box-shadow: 0 0 0 2px rgb(129 140 248); border-color: transparent; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-700 uppercase tracking-wide">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

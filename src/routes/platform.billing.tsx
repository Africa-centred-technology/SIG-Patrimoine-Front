import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/platform/billing")({
  component: BillingPage,
});

const PLANS = [
  { key: "STARTER", nom: "Starter", cible: "Petite commune / essai", seats: 5, prix: 0, note: "Essai gratuit 30 jours" },
  { key: "PRO", nom: "Pro", cible: "Commune / gestionnaire", seats: 25, prix: 4900, note: "Le plus populaire" },
  { key: "ENTERPRISE", nom: "Enterprise", cible: "Grande ville / multi-sites", seats: -1, prix: -1, note: "Sur devis" },
];

function BillingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Facturation & plans</h2>
        <p className="text-sm text-slate-500">Souscrivez ou renouvelez une licence par produit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map(p => {
          const isSelected = selected === p.key;
          return (
            <div key={p.key} className={`rounded-2xl border-2 bg-white p-6 shadow-sm transition ${isSelected ? "border-indigo-600 shadow-lg shadow-indigo-600/10" : "border-slate-200"} ${p.key === "PRO" ? "relative" : ""}`}>
              {p.key === "PRO" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase tracking-wide font-bold px-3 py-1 rounded-full">Populaire</span>
              )}
              <div className="text-sm text-slate-500 uppercase tracking-wide">{p.nom}</div>
              <div className="mt-3 text-3xl font-bold text-slate-900">
                {p.prix < 0 ? "Sur devis" : p.prix === 0 ? "Gratuit" : `${p.prix.toLocaleString("fr-FR")}`}
                {p.prix > 0 && <span className="text-sm text-slate-500 font-normal"> MAD/mois</span>}
              </div>
              <div className="text-xs text-slate-500 mt-1">{p.note}</div>
              <ul className="mt-5 text-sm space-y-2 text-slate-700">
                <li className="flex gap-2"><CheckCircle2 className="text-green-600 h-4 w-4 mt-0.5 shrink-0" /> {p.cible}</li>
                <li className="flex gap-2"><CheckCircle2 className="text-green-600 h-4 w-4 mt-0.5 shrink-0" /> {p.seats < 0 ? "Sièges illimités" : `${p.seats} sièges inclus`}</li>
                <li className="flex gap-2"><CheckCircle2 className="text-green-600 h-4 w-4 mt-0.5 shrink-0" /> Support standard</li>
                <li className="flex gap-2"><CheckCircle2 className="text-green-600 h-4 w-4 mt-0.5 shrink-0" /> Mises à jour incluses</li>
              </ul>
              <button
                onClick={() => { setSelected(p.key); setPaid(false); }}
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-semibold transition ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
              >
                {isSelected ? "Sélectionné" : "Choisir ce plan"}
              </button>
            </div>
          );
        })}
      </div>

      {selected && !paid && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="text-indigo-600" />
            <h3 className="font-semibold">Paiement sécurisé (démo)</h3>
            <Lock size={14} className="text-slate-400" />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setPaid(true); }} className="space-y-3">
            <input placeholder="Nom sur la carte" required className="input" />
            <input placeholder="1234 5678 9012 3456" required className="input" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="MM/AA" required className="input" />
              <input placeholder="CVC" required className="input" />
            </div>
            <button className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20">
              Procéder au paiement
            </button>
            <p className="text-[11px] text-slate-400 text-center">Aucune transaction réelle · Simulation d'ossature future (Stripe/CMI)</p>
          </form>
          <style>{`.input { width:100%; padding:0.65rem 0.85rem; border:1px solid rgb(226 232 240); background: rgb(248 250 252); border-radius:0.5rem; font-size:0.875rem; outline:none; } .input:focus { box-shadow: 0 0 0 2px rgb(129 140 248); border-color: transparent; }`}</style>
        </div>
      )}
      {paid && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <CheckCircle2 className="text-emerald-600 h-10 w-10 mx-auto mb-2" />
          <h3 className="font-semibold text-emerald-900">Paiement confirmé — licence activée</h3>
          <p className="text-sm text-emerald-700 mt-1">Votre plan <strong>{selected}</strong> est actif (simulation).</p>
        </div>
      )}
    </div>
  );
}

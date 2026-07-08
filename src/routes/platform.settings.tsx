import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/platform/settings")({ component: SettingsPage });
function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Paramètres de la plateforme</h2>
      <p className="text-sm text-slate-500 mb-6">Options d'administration globale (démo).</p>
      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {["Marque & identité", "Sécurité & audit", "Facturation globale", "Intégrations (Stripe/CMI — à venir)", "Notifications"].map(x => (
          <div key={x} className="p-4 flex items-center justify-between hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-800">{x}</span>
            <span className="text-xs text-slate-400">Bientôt</span>
          </div>
        ))}
      </div>
    </div>
  );
}

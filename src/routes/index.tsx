import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, CheckCircle2, Clock, Lock, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { Tenant } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: LoginDemo,
  head: () => ({
    meta: [{ title: "Accès démo — SIG Patrimoine" }],
  }),
});

function badgeState(t: Tenant, licenceActives: number) {
  if (t.statut === "SUSPENDU" || licenceActives === 0)
    return { icon: Lock, text: "Expirée", tone: "text-red-300 bg-red-500/10 ring-red-400/30" };
  if (t.statut === "EN_ATTENTE")
    return { icon: Clock, text: "Essai", tone: "text-amber-300 bg-amber-500/10 ring-amber-400/30" };
  return {
    icon: CheckCircle2,
    text: "Actif",
    tone: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30",
  };
}

function initials(nom: string) {
  return nom
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

function LoginDemo() {
  const { tenants, licences, loginAsSuperAdmin, loginAsTenant } = useApp();
  const navigate = useNavigate();

  const handleSuperAdmin = () => {
    loginAsSuperAdmin();
    navigate({ to: "/platform/dashboard" });
  };
  const handleTenant = (t: Tenant) => {
    loginAsTenant(t.id);
    navigate({ to: "/select-product" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Blobs décoratifs */}
      <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-amber-500/40">
            SP
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">SIG Patrimoine</h1>
            <p className="text-amber-300/80 text-xs">Gestion de patrimoine territorial · Démo</p>
          </div>
        </div>

        {/* Carte Super Admin */}
        <button
          onClick={handleSuperAdmin}
          className="w-full group text-left rounded-2xl bg-slate-800/70 hover:bg-slate-800 backdrop-blur border border-amber-500/30 hover:border-amber-400 p-6 shadow-2xl transition mb-10 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/40 shrink-0">
              <Shield className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-lg">Administrateur SIG Patrimoine</div>
              <div className="text-amber-100/70 text-sm">
                Gérer les organisations, produits, licences et statistiques globales
              </div>
            </div>
            <ArrowRight className="text-amber-300 group-hover:text-white group-hover:translate-x-1 transition" />
          </div>
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-widest text-amber-300/90">
            Ou entrer dans une organisation
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Grille tenants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((t) => {
            const licsTenant = licences.filter((l) => l.tenantId === t.id);
            const actives = licsTenant.filter(
              (l) => l.statut === "ACTIVE" || l.statut === "ESSAI",
            ).length;
            const st = badgeState(t, actives);
            const StIcon = st.icon;
            return (
              <button
                key={t.id}
                onClick={() => handleTenant(t)}
                className="group text-left rounded-xl bg-slate-800/50 hover:bg-slate-800 backdrop-blur border border-slate-700 hover:border-amber-400 p-5 shadow-xl transition focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shrink-0">
                    {initials(t.nom)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                      {t.nom}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">{t.ville}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {t.produits.includes("ESPACES_VERTS") && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
                      Espaces Verts
                    </span>
                  )}
                  {t.produits.includes("ECLAIRAGE") && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30">
                      Éclairage
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ${st.tone}`}
                  >
                    <StIcon className="h-3 w-3" /> {st.text}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10">
          Démo frontend · Aucun mot de passe requis · Données simulées
        </p>
      </div>
    </div>
  );
}

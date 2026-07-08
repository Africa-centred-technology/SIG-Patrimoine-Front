import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trees, Lightbulb, Lock, LogOut, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useApp, useTenant, useLicencesFor } from "@/contexts/AppContext";
import type { ProduitCle } from "@/lib/types";

export const Route = createFileRoute("/select-product")({
  component: SelectProduct,
  head: () => ({ meta: [{ title: "Choisir un produit — SIG Patrimoine" }] }),
});

function SelectProduct() {
  const { currentTenantId, setActiveProduct, logout } = useApp();
  const tenant = useTenant(currentTenantId);
  const licences = useLicencesFor(currentTenantId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentTenantId) navigate({ to: "/" });
  }, [currentTenantId, navigate]);

  if (!tenant) return null;

  const licEV = licences.find((l) => l.produit === "ESPACES_VERTS");
  const licECL = licences.find((l) => l.produit === "ECLAIRAGE");

  const enter = (p: ProduitCle) => {
    setActiveProduct(p);
    navigate({ to: p === "ESPACES_VERTS" ? "/espaces-verts/dashboard" : "/eclairage/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">SP</div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">{tenant.nom}</div>
              <div className="text-xs text-slate-500">{tenant.ville} · Choisissez un produit</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
          >
            <LogOut size={14} /> Changer d'organisation
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Sélectionnez un produit</h1>
        <p className="text-slate-500 text-center mb-10 text-sm">Les produits verrouillés nécessitent une licence active.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductCard
            title="Espaces Verts"
            desc="Gestion du patrimoine végétal, entretien, planification, réclamations."
            icon={Trees}
            gradient="from-emerald-600 to-emerald-800"
            licence={licEV}
            onEnter={() => enter("ESPACES_VERTS")}
          />
          <ProductCard
            title="Green Éclairage"
            desc="Gestion des points lumineux, réseau électrique, maintenance et énergie."
            icon={Lightbulb}
            gradient="from-amber-500 to-stone-900"
            licence={licECL}
            onEnter={() => enter("ECLAIRAGE")}
          />
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  title,
  desc,
  icon: Icon,
  gradient,
  licence,
  onEnter,
}: {
  title: string;
  desc: string;
  icon: typeof Trees;
  gradient: string;
  licence: ReturnType<typeof useLicencesFor>[number] | undefined;
  onEnter: () => void;
}) {
  const active = licence && (licence.statut === "ACTIVE" || licence.statut === "ESSAI");
  const navigate = useNavigate();
  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white flex flex-col`}>
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative`}>
        <Icon className="h-10 w-10 opacity-90" />
        <h3 className="mt-3 text-xl font-bold">{title}</h3>
        <p className="text-sm text-white/80 mt-1">{desc}</p>
        {!active && (
          <div className="absolute top-4 right-4 bg-white/20 rounded-full p-2 backdrop-blur">
            <Lock size={16} />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        {licence ? (
          <div className="text-sm">
            <div className="text-slate-500">
              Plan <span className="font-semibold text-slate-900">{licence.plan}</span> · {licence.seatsUtilises}/{licence.seats} sièges
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Statut : <span className={active ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>{licence.statut}</span> · Expire le {licence.dateFin}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Aucune licence attribuée pour ce produit.</div>
        )}

        {active ? (
          <button
            onClick={onEnter}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-sm font-semibold transition"
          >
            Entrer <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/platform/billing" })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 text-sm font-semibold transition"
          >
            <Lock size={14} /> Renouveler la licence
          </button>
        )}
      </div>
    </div>
  );
}

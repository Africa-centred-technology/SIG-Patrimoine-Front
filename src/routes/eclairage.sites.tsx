import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, Lightbulb, AlertTriangle, Zap, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { ZONES, LUMINAIRES } from "@/lib/mockData";
import { kWhMois, coutMAD, SEUIL_ALERTE_PANNE } from "@/lib/eclairage";

export const Route = createFileRoute("/eclairage/sites")({ component: ZonesPage });

function ZonesPage() {
  const totalLum = LUMINAIRES.length;
  const puissanceTotale = LUMINAIRES.reduce((s, l) => s + l.puissance_w, 0) / 1000;
  const enAlerte = ZONES.filter((z) => {
    const lums = LUMINAIRES.filter((l) => l.site_id === z.id);
    const panne = lums.filter((l) => l.etat === "EN_PANNE").length;
    return lums.length > 0 && panne / lums.length > SEUIL_ALERTE_PANNE;
  }).length;

  return (
    <div className="space-y-5">
      <ModuleHeader closeTo="/eclairage/map"
        title="Zones / Secteurs d'éclairage"
        subtitle={`${ZONES.length} secteurs · ${totalLum} luminaires gérés`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Layers}
          label="Secteurs"
          value={ZONES.length}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Lightbulb}
          label="Luminaires"
          value={totalLum}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          icon={Zap}
          label="Puissance"
          value={`${puissanceTotale.toFixed(1)} kW`}
          color="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={AlertTriangle}
          label="Secteurs en alerte"
          value={enAlerte}
          color="bg-red-100 text-red-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ZONES.map((z) => {
          const lums = LUMINAIRES.filter((l) => l.site_id === z.id);
          const panne = lums.filter((l) => l.etat === "EN_PANNE").length;
          const led = lums.filter((l) => l.type === "LED").length;
          const puiss = lums.reduce((s, l) => s + l.puissance_w, 0) / 1000;
          const conso = lums.reduce((s, l) => s + kWhMois(l), 0);
          const tauxPanne = lums.length ? (panne / lums.length) * 100 : 0;
          const alerte = tauxPanne > SEUIL_ALERTE_PANNE * 100;
          return (
            <div key={z.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{z.nom}</h3>
                  <p className="text-xs text-slate-500 mt-1">Allumage : {z.calendrier_allumage}</p>
                </div>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${alerte ? "bg-red-100" : "bg-amber-100"}`}
                >
                  <Layers className={alerte ? "text-red-600" : "text-amber-700"} size={18} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                <Stat n={lums.length} l="Luminaires" />
                <Stat n={led} l="LED" />
                <Stat n={panne} l="En panne" tone={panne ? "text-red-600" : undefined} />
                <Stat n={`${puiss.toFixed(1)}`} l="kW" />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Taux de panne</span>
                  <span className={alerte ? "text-red-600 font-semibold" : ""}>
                    {tauxPanne.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${alerte ? "bg-red-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, tauxPanne)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Conso ≈ {conso.toFixed(0)} kWh/mois · {coutMAD(conso).toLocaleString("fr-FR")} MAD
                </span>
                <Link
                  to="/eclairage/map"
                  className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium"
                >
                  <MapPin size={13} /> Carte
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ n, l, tone }: { n: number | string; l: string; tone?: string }) {
  return (
    <div>
      <div className={`text-lg font-bold ${tone ?? "text-slate-900"}`}>{n}</div>
      <div className="text-[11px] text-slate-500">{l}</div>
    </div>
  );
}

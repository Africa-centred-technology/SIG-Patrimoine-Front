import { createFileRoute } from "@tanstack/react-router";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { LUMINAIRES, RESEAU_ELEC, PANNES, CENTER } from "@/lib/mockData";

export const Route = createFileRoute("/eclairage/map")({ component: MapEclairage });

const COLOR_TYPE: Record<string, string> = {
  LED: "#f59e0b",
  SODIUM: "#f97316",
  PROJECTEUR: "#eab308",
  BORNE: "#fbbf24",
  APPLIQUE: "#fcd34d",
  GUIRLANDE: "#a78bfa",
};
const COLOR_ELEC: Record<string, string> = {
  ARMOIRE: "#0369a1",
  LIGNE: "#0284c7",
  COFFRET: "#0ea5e9",
  TRANSFORMATEUR: "#075985",
  COMPTEUR: "#38bdf8",
  CELLULE_PHOTO: "#7dd3fc",
};

function MapEclairage() {
  const markers = [
    ...LUMINAIRES.map(l => ({ lat: l.coordinates.lat, lng: l.coordinates.lng, color: COLOR_TYPE[l.type], size: 8, title: `${l.reference} · ${l.type}` })),
    ...RESEAU_ELEC.map(e => ({ lat: e.coordinates.lat, lng: e.coordinates.lng, color: COLOR_ELEC[e.type], size: 12, title: `${e.reference} · ${e.type}` })),
    ...PANNES.filter(p => p.statut === "NOUVEAU" || p.statut === "EN_COURS").map(p => ({ lat: p.coordinates.lat, lng: p.coordinates.lng, color: "#ef4444", size: 14, title: p.reference })),
  ];
  const legend = [
    { color: "#f59e0b", label: "Luminaire LED" },
    { color: "#f97316", label: "Sodium" },
    { color: "#a78bfa", label: "Guirlande" },
    { color: "#0369a1", label: "Armoire élec." },
    { color: "#0284c7", label: "Coffret / réseau" },
    { color: "#ef4444", label: "Panne active" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cartographie du réseau lumineux</h2>
          <p className="text-sm text-slate-500">Luminaires (ambre) · Réseau électrique (bleu) · Signalements (rouge)</p>
        </div>
        <div className="flex gap-2">
          {["Plan", "Satellite", "Relief"].map((x, i) => (
            <button key={x} className={`px-3 py-1.5 text-xs rounded-md border ${i === 0 ? "bg-amber-500 text-white border-amber-500" : "bg-white hover:bg-slate-50"}`}>{x}</button>
          ))}
        </div>
      </div>
      <MapPlaceholder markers={markers} center={CENTER} legend={legend} />
    </div>
  );
}

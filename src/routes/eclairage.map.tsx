import { createFileRoute } from "@tanstack/react-router";
import { TileMap, type MapMarker } from "@/components/shared/TileMap";
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
  const luminairesEnPanne = LUMINAIRES.filter((l) => l.etat === "EN_PANNE").length;

  const markers: MapMarker[] = [
    ...LUMINAIRES.map((l) => ({
      lat: l.coordinates.lat,
      lng: l.coordinates.lng,
      color: l.etat === "EN_PANNE" ? "#ef4444" : (COLOR_TYPE[l.type] ?? "#f59e0b"),
      size: 9,
      title: `${l.reference} · ${l.type} · ${l.puissance_w} W · ${l.etat}`,
    })),
    ...RESEAU_ELEC.map((e) => ({
      lat: e.coordinates.lat,
      lng: e.coordinates.lng,
      color: COLOR_ELEC[e.type] ?? "#0369a1",
      size: 13,
      title: `${e.reference} · ${e.type} · ${e.etat}`,
    })),
    ...PANNES.filter((p) => p.statut === "NOUVEAU" || p.statut === "EN_COURS").map((p) => ({
      lat: p.coordinates.lat,
      lng: p.coordinates.lng,
      color: "#dc2626",
      size: 15,
      title: `${p.reference} · signalement`,
    })),
  ];

  const legend = [
    { color: "#f59e0b", label: "Luminaire LED" },
    { color: "#f97316", label: "Sodium (SHP)" },
    { color: "#eab308", label: "Projecteur" },
    { color: "#a78bfa", label: "Guirlande / festif" },
    { color: "#0369a1", label: "Armoire électrique" },
    { color: "#0ea5e9", label: "Coffret / réseau" },
    { color: "#075985", label: "Transformateur" },
    { color: "#ef4444", label: "Luminaire en panne" },
    { color: "#dc2626", label: "Signalement actif" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cartographie du réseau lumineux</h2>
          <p className="text-sm text-slate-500">
            {LUMINAIRES.length} luminaires · {RESEAU_ELEC.length} équipements réseau ·{" "}
            {luminairesEnPanne} en panne · fond Plan / Satellite / Relief
          </p>
        </div>
      </div>
      <TileMap markers={markers} center={CENTER} zoom={15} legend={legend} />
    </div>
  );
}

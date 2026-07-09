import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Lightbulb, Zap, AlertTriangle, Plus, Check } from "lucide-react";
import { TileMap, type MarkerGroup, type MapLine } from "@/components/shared/TileMap";
import { LUMINAIRES, RESEAU_ELEC, PANNES, RUES, CENTER } from "@/lib/mockData";
import type { Luminaire } from "@/lib/types";

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
const ETAT_LABEL: Record<string, string> = {
  ALLUME: "Allumé",
  ETEINT: "Éteint",
  EN_PANNE: "En panne",
  MAINTENANCE: "Maintenance",
  VETUSTE: "Vétuste",
};
const PANNE_TYPE_LABEL: Record<string, string> = {
  LUMINAIRE_ETEINT: "Luminaire éteint",
  POINT_NOIR: "Point noir",
  CLIGNOTANT: "Clignotant",
  ARMOIRE_HS: "Armoire hors service",
  CABLE_ENDOMMAGE: "Câble endommagé",
  VANDALISME: "Vandalisme",
};

const legend = [
  { color: "#f59e0b", label: "Luminaire LED", icon: Lightbulb },
  { color: "#f97316", label: "Sodium (SHP)", icon: Lightbulb },
  { color: "#eab308", label: "Projecteur", icon: Lightbulb },
  { color: "#a78bfa", label: "Guirlande / festif", icon: Lightbulb },
  { color: "#ef4444", label: "Luminaire en panne", icon: Lightbulb },
  { color: "#0369a1", label: "Armoire / équipement réseau", icon: Zap },
  { color: "#0369a1", label: "Câble réseau (le long des voies)", line: true },
  { color: "#dc2626", label: "Signalement actif", icon: AlertTriangle },
];

interface EclairageMapProps {
  active: boolean;
}

/**
 * Carte persistante du produit Green Éclairage : reste en fond permanent,
 * les modules flottent par-dessus (map-centric, comme Espaces Verts).
 */
export function EclairageMap({ active }: EclairageMapProps) {
  const focus = useRouterState({
    select: (s) => (s.location.search as { focus?: string }).focus,
  });
  const [ajoutes, setAjoutes] = useState<Luminaire[]>([]);
  const [addMode, setAddMode] = useState(false);

  const tousLuminaires = [...LUMINAIRES, ...ajoutes];
  const pannesActives = PANNES.filter((p) => p.statut === "NOUVEAU" || p.statut === "EN_COURS");

  const handleMapClick = (p: { lat: number; lng: number }) => {
    const n = tousLuminaires.length + 1;
    setAjoutes((prev) => [
      ...prev,
      {
        id: `lum-new-${Date.now()}`,
        reference: `LUM-${String(n).padStart(4, "0")}`,
        type: "LED",
        puissance_w: 80,
        hauteur_feu_m: 8,
        etat: "ALLUME",
        temperature_couleur_k: 4000,
        date_pose: new Date().toISOString().slice(0, 10),
        site_id: "z1",
        coordinates: p,
      },
    ]);
  };

  const lignes: MapLine[] = RUES.map((r) => ({ path: r.path, color: "#0369a1", width: 3 }));

  const groups: MarkerGroup[] = [
    {
      key: "luminaires",
      label: "Luminaires",
      color: "#f59e0b",
      markers: tousLuminaires.map((l) => ({
        id: l.id,
        lat: l.coordinates.lat,
        lng: l.coordinates.lng,
        color: l.etat === "EN_PANNE" ? "#ef4444" : (COLOR_TYPE[l.type] ?? "#f59e0b"),
        icon: Lightbulb,
        title: l.reference,
        subtitle: `${l.type} · ${l.puissance_w} W`,
        details: [
          { label: "Type", value: l.type },
          { label: "Puissance", value: `${l.puissance_w} W` },
          { label: "État", value: ETAT_LABEL[l.etat] ?? l.etat },
          ...(l.hauteur_feu_m ? [{ label: "Hauteur", value: `${l.hauteur_feu_m} m` }] : []),
          ...(l.date_pose ? [{ label: "Pose", value: l.date_pose }] : []),
          { label: "Secteur", value: l.site_id },
        ],
      })),
    },
    {
      key: "reseau",
      label: "Réseau électrique",
      color: "#0369a1",
      markers: RESEAU_ELEC.map((e) => ({
        id: e.id,
        lat: e.coordinates.lat,
        lng: e.coordinates.lng,
        color: COLOR_ELEC[e.type] ?? "#0369a1",
        icon: Zap,
        title: e.reference,
        subtitle: e.type,
        details: [
          { label: "Type", value: e.type },
          { label: "État", value: e.etat },
          ...(e.puissance_kva ? [{ label: "Puissance", value: `${e.puissance_kva} kVA` }] : []),
          ...(e.nb_departs ? [{ label: "Départs", value: String(e.nb_departs) }] : []),
        ],
      })),
    },
    {
      key: "pannes",
      label: "Signalements actifs",
      color: "#dc2626",
      markers: pannesActives.map((p) => ({
        id: p.id,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        color: "#dc2626",
        icon: AlertTriangle,
        title: p.reference,
        subtitle: PANNE_TYPE_LABEL[p.type] ?? p.type,
        details: [
          { label: "Type", value: PANNE_TYPE_LABEL[p.type] ?? p.type },
          { label: "Urgence", value: `${p.urgence}/5` },
          { label: "Description", value: p.description },
        ],
      })),
    },
  ];

  return (
    <div className="relative h-full w-full">
      <TileMap
        groups={groups}
        lines={lignes}
        center={CENTER}
        zoom={14}
        legend={legend}
        focusId={focus}
        addMode={addMode}
        onMapClick={handleMapClick}
        height="h-full"
      />

      {/* Bouton d'ajout (visible sur la vue carte) */}
      {active && (
        <button
          onClick={() => setAddMode((v) => !v)}
          className={`absolute bottom-4 left-4 z-[500] inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition ${
            addMode
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          {addMode ? <Check size={16} /> : <Plus size={16} />}
          {addMode ? "Terminer le placement" : "Ajouter un luminaire"}
        </button>
      )}
    </div>
  );
}

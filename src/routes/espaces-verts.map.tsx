import { createFileRoute } from "@tanstack/react-router";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { CENTER } from "@/lib/mockData";

export const Route = createFileRoute("/espaces-verts/map")({ component: MapEV });

const VEG = [
  { color: "#059669", label: "Arbre" },
  { color: "#84cc16", label: "Gazon" },
  { color: "#f97316", label: "Palmier" },
  { color: "#10b981", label: "Arbuste" },
  { color: "#ec4899", label: "Vivace" },
  { color: "#06b6d4", label: "Cactus" },
  { color: "#eab308", label: "Graminée" },
];

function MapEV() {
  const markers = Array.from({ length: 60 }).map((_, i) => {
    const v = VEG[i % VEG.length];
    return {
      lat: CENTER.lat + (Math.random() - 0.5) * 0.02,
      lng: CENTER.lng + (Math.random() - 0.5) * 0.02,
      color: v.color,
      size: 9,
      title: v.label,
    };
  });
  const hydro = [
    { lat: CENTER.lat + 0.005, lng: CENTER.lng + 0.003, color: "#0ea5e9", size: 12, title: "Point d'eau" },
    { lat: CENTER.lat - 0.006, lng: CENTER.lng - 0.004, color: "#06b6d4", size: 12, title: "Bassin" },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Cartographie du patrimoine végétal</h2>
        <p className="text-sm text-slate-500">Végétation, hydraulique, sites</p>
      </div>
      <MapPlaceholder markers={[...markers, ...hydro]} legend={[...VEG, { color: "#0ea5e9", label: "Hydraulique" }]} center={CENTER} />
    </div>
  );
}

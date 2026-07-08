import type { ReactNode } from "react";

interface Marker {
  lat: number;
  lng: number;
  color: string;
  size?: number;
  title?: string;
  icon?: ReactNode;
}

interface MapPlaceholderProps {
  markers: Marker[];
  center?: { lat: number; lng: number };
  spanDeg?: number;
  legend?: Array<{ color: string; label: string }>;
  overlay?: ReactNode;
  height?: string;
}

// Placeholder « crédible » : fond dégradé + trame + marqueurs positionnés en absolu
export function MapPlaceholder({
  markers,
  center = { lat: 32.216, lng: -7.937 },
  spanDeg = 0.03,
  legend,
  overlay,
  height = "h-[calc(100vh-13rem)]",
}: MapPlaceholderProps) {
  const project = (lat: number, lng: number) => {
    const x = ((lng - center.lng) / spanDeg + 0.5) * 100;
    const y = ((center.lat - lat) / spanDeg + 0.5) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };
  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-100`}>
      {/* Grille */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Rues stylisées */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0 50 Q30 30 60 50 T100 45" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />
        <path d="M20 0 Q30 50 20 100" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />
        <path d="M70 0 L80 100" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />
        <path d="M0 20 L100 25" stroke="#cbd5e1" strokeWidth="0.6" fill="none" />
        <path d="M0 80 L100 78" stroke="#cbd5e1" strokeWidth="0.6" fill="none" />
      </svg>
      {/* Marqueurs */}
      {markers.map((m, i) => {
        const p = project(m.lat, m.lng);
        const size = m.size ?? 10;
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: p.left, top: p.top }}
            title={m.title}
          >
            <div
              className="rounded-full ring-2 ring-white shadow"
              style={{ width: size, height: size, backgroundColor: m.color }}
            />
          </div>
        );
      })}
      {overlay}
      {/* Légende */}
      {legend && legend.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 text-xs space-y-1 border border-slate-200">
          <div className="font-semibold text-slate-700 mb-1">Légende</div>
          {legend.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full ring-1 ring-white" style={{ backgroundColor: l.color }} />
              <span className="text-slate-700">{l.label}</span>
            </div>
          ))}
        </div>
      )}
      {/* Watermark */}
      <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 bg-white/70 px-2 py-0.5 rounded">
        Carte de démonstration · Benguérir
      </div>
    </div>
  );
}

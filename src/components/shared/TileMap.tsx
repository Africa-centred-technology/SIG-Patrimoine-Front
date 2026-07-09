import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface MapMarker {
  lat: number;
  lng: number;
  color: string;
  size?: number;
  title?: string;
}

interface TileMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  legend?: Array<{ color: string; label: string }>;
  height?: string;
}

type LayerKey = "plan" | "satellite" | "relief";

const LAYERS: Record<
  LayerKey,
  { label: string; url: (z: number, x: number, y: number) => string; attribution: string }
> = {
  plan: {
    label: "Plan",
    url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    attribution: "© OpenStreetMap",
  },
  satellite: {
    label: "Satellite",
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    attribution: "© Esri, Maxar",
  },
  relief: {
    label: "Relief",
    url: (z, x, y) => `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`,
    attribution: "© OpenTopoMap",
  },
};

const TILE = 256;

function project(lat: number, lng: number, z: number) {
  const scale = TILE * Math.pow(2, z);
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

const MIN_Z = 10;
const MAX_Z = 18;

export function TileMap({
  markers,
  center = { lat: 32.216, lng: -7.937 },
  zoom = 15,
  legend,
  height = "h-[calc(100vh-13rem)]",
}: TileMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [z, setZ] = useState(zoom);
  const [layer, setLayer] = useState<LayerKey>("plan");

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const wc = project(center.lat, center.lng, z);
  const originX = wc.x - w / 2;
  const originY = wc.y - h / 2;

  // Tuiles couvrant le viewport
  const tiles: { key: string; url: string; left: number; top: number }[] = [];
  if (w > 0 && h > 0) {
    const n = Math.pow(2, z);
    const startX = Math.floor(originX / TILE);
    const endX = Math.floor((originX + w) / TILE);
    const startY = Math.floor(originY / TILE);
    const endY = Math.floor((originY + h) / TILE);
    for (let tx = startX; tx <= endX; tx++) {
      for (let ty = startY; ty <= endY; ty++) {
        const wrappedX = ((tx % n) + n) % n;
        if (ty < 0 || ty >= n) continue;
        tiles.push({
          key: `${tx}-${ty}`,
          url: LAYERS[layer].url(z, wrappedX, ty),
          left: tx * TILE - originX,
          top: ty * TILE - originY,
        });
      }
    }
  }

  return (
    <div
      ref={ref}
      className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-200`}
    >
      {/* Tuiles */}
      {tiles.map((t) => (
        <img
          key={t.key}
          src={t.url}
          alt=""
          width={TILE}
          height={TILE}
          loading="lazy"
          className="absolute select-none pointer-events-none max-w-none"
          style={{ left: t.left, top: t.top }}
        />
      ))}

      {/* Marqueurs */}
      {w > 0 &&
        markers.map((m, i) => {
          const p = project(m.lat, m.lng, z);
          const left = p.x - originX;
          const top = p.y - originY;
          if (left < -20 || left > w + 20 || top < -20 || top > h + 20) return null;
          const s = m.size ?? 10;
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
              title={m.title}
            >
              <div
                className="rounded-full ring-2 ring-white shadow-md hover:scale-125 transition-transform cursor-pointer"
                style={{ width: s, height: s, backgroundColor: m.color }}
              />
            </div>
          );
        })}

      {/* Sélecteur de fond */}
      <div className="absolute top-3 right-3 flex gap-1 bg-white/90 backdrop-blur rounded-lg p-1 shadow-lg border border-slate-200">
        {(Object.keys(LAYERS) as LayerKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setLayer(k)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              layer === k ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {LAYERS[k].label}
          </button>
        ))}
      </div>

      {/* Zoom */}
      <div className="absolute top-16 right-3 flex flex-col bg-white/90 backdrop-blur rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <button
          onClick={() => setZ((v) => Math.min(MAX_Z, v + 1))}
          className="p-1.5 hover:bg-slate-100 text-slate-700"
          title="Zoomer"
        >
          <Plus size={16} />
        </button>
        <div className="h-px bg-slate-200" />
        <button
          onClick={() => setZ((v) => Math.max(MIN_Z, v - 1))}
          className="p-1.5 hover:bg-slate-100 text-slate-700"
          title="Dézoomer"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Légende */}
      {legend && legend.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 text-xs space-y-1 border border-slate-200 max-h-56 overflow-auto">
          <div className="font-semibold text-slate-700 mb-1">Légende</div>
          {legend.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full ring-1 ring-white" style={{ backgroundColor: l.color }} />
              <span className="text-slate-700">{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 text-[10px] text-slate-600 bg-white/70 px-1.5 py-0.5 rounded">
        {LAYERS[layer].attribution}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Plus, Minus, X, Crosshair } from "lucide-react";

type IconCmp = ComponentType<{ size?: number; className?: string }>;

export interface MapMarker {
  id?: string;
  lat: number;
  lng: number;
  color: string;
  size?: number;
  title?: string;
  subtitle?: string;
  details?: { label: string; value: string }[];
  /** icône de symbologie (sinon un point coloré est affiché). */
  icon?: IconCmp;
}

export interface MarkerGroup {
  key: string;
  label: string;
  color: string;
  markers: MapMarker[];
}

export interface MapLine {
  path: { lat: number; lng: number }[];
  color: string;
  width?: number;
  dash?: boolean;
}

interface TileMapProps {
  groups?: MarkerGroup[];
  markers?: MapMarker[];
  lines?: MapLine[];
  center?: { lat: number; lng: number };
  zoom?: number;
  legend?: Array<{ color: string; label: string }>;
  height?: string;
  /** id d'un marqueur à centrer + sélectionner (ex. depuis l'inventaire). */
  focusId?: string;
  /** mode « ajouter » : un clic sur le fond appelle onMapClick. */
  addMode?: boolean;
  onMapClick?: (p: { lat: number; lng: number }) => void;
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
const MIN_Z = 10;
const MAX_Z = 18;

function project(lat: number, lng: number, z: number) {
  const scale = TILE * Math.pow(2, z);
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

function unproject(x: number, y: number, z: number) {
  const scale = TILE * Math.pow(2, z);
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

export function TileMap({
  groups,
  markers,
  lines,
  center: centerProp = { lat: 32.216, lng: -7.937 },
  zoom = 15,
  legend,
  height = "h-[calc(100vh-13rem)]",
  focusId,
  addMode = false,
  onMapClick,
}: TileMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [z, setZ] = useState(zoom);
  const [center, setCenter] = useState(centerProp);
  const [layer, setLayer] = useState<LayerKey>("relief");
  const [selected, setSelected] = useState<MapMarker | null>(null);

  // Calques (groupes) : tous visibles par défaut
  const allGroups: MarkerGroup[] =
    groups ?? (markers ? [{ key: "all", label: "Objets", color: "#64748b", markers }] : []);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const visibleMarkers = allGroups.filter((g) => !hidden.has(g.key)).flatMap((g) => g.markers);

  // Mesure du conteneur
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Zoom molette (listener natif non-passif pour empêcher le scroll de page)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZ((v) => Math.max(MIN_Z, Math.min(MAX_Z, v + (e.deltaY < 0 ? 1 : -1))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Focus externe (ex. depuis l'inventaire) : centre + sélectionne un marqueur
  useEffect(() => {
    if (!focusId) return;
    for (const g of allGroups) {
      const m = g.markers.find((mk) => mk.id === focusId);
      if (m) {
        setCenter({ lat: m.lat, lng: m.lng });
        setZ(17);
        setHidden((prev) => {
          const next = new Set(prev);
          next.delete(g.key); // s'assurer que le calque est visible
          return next;
        });
        setSelected(m);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  const { w, h } = size;
  const wc = project(center.lat, center.lng, z);
  const originX = wc.x - w / 2;
  const originY = wc.y - h / 2;

  // Glisser pour déplacer (pan)
  const drag = useRef<{
    x: number;
    y: number;
    center: { lat: number; lng: number };
    moved: boolean;
  } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    // Ne pas démarrer le pan si on interagit avec un contrôle (bouton) : sinon la
    // capture du pointeur « avale » le clic (sélecteur de fond, zoom, marqueurs...).
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, center, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    const cw = project(d.center.lat, d.center.lng, z);
    setCenter(unproject(cw.x - dx, cw.y - dy, z));
  };
  const onPointerUp = () => {
    const d = drag.current;
    // Clic (sans glissement) sur le fond en mode ajout → placer un objet
    if (d && !d.moved && addMode && onMapClick && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const px = d.x - rect.left;
      const py = d.y - rect.top;
      onMapClick(unproject(originX + px, originY + py, z));
    }
    drag.current = null;
  };

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
          key: `${layer}-${z}-${tx}-${ty}`,
          url: LAYERS[layer].url(z, wrappedX, ty),
          left: tx * TILE - originX,
          top: ty * TILE - originY,
        });
      }
    }
  }

  const toggleGroup = (k: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-200 touch-none ${addMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
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
          draggable={false}
          className="absolute select-none pointer-events-none max-w-none"
          style={{ left: t.left, top: t.top }}
        />
      ))}

      {/* Lignes (rues / câbles) */}
      {w > 0 && lines && lines.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none" width={w} height={h}>
          {lines.map((ln, i) => {
            const pts = ln.path
              .map((p) => {
                const pr = project(p.lat, p.lng, z);
                return `${pr.x - originX},${pr.y - originY}`;
              })
              .join(" ");
            return (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke={ln.color}
                strokeWidth={ln.width ?? 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={ln.dash ? "6 6" : undefined}
                opacity={0.9}
              />
            );
          })}
        </svg>
      )}

      {/* Marqueurs */}
      {w > 0 &&
        visibleMarkers.map((m, i) => {
          const p = project(m.lat, m.lng, z);
          const left = p.x - originX;
          const top = p.y - originY;
          if (left < -20 || left > w + 20 || top < -20 || top > h + 20) return null;
          const s = m.size ?? 10;
          const isSel = selected && (selected.id ? selected.id === m.id : selected === m);
          const Icon = m.icon;
          return (
            <button
              key={m.id ?? i}
              onClick={(e) => {
                e.stopPropagation();
                if (drag.current?.moved) return;
                setSelected(m);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
              title={m.title}
            >
              {Icon ? (
                // Symbole : pastille colorée + icône blanche
                <span
                  className={`flex items-center justify-center rounded-full shadow-md ring-2 ${isSel ? "ring-slate-900 scale-110" : "ring-white"}`}
                  style={{ width: 24, height: 24, backgroundColor: m.color }}
                >
                  <Icon size={14} className="text-white" />
                </span>
              ) : (
                <span
                  className={`block rounded-full ring-2 shadow-md ${isSel ? "ring-slate-900" : "ring-white"}`}
                  style={{
                    width: isSel ? s + 6 : s,
                    height: isSel ? s + 6 : s,
                    backgroundColor: m.color,
                  }}
                />
              )}
            </button>
          );
        })}

      {/* Calques (groupes) */}
      {allGroups.length > 1 && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg border border-slate-200 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 px-1">Calques</div>
          {allGroups.map((g) => {
            const on = !hidden.has(g.key);
            return (
              <button
                key={g.key}
                onClick={() => toggleGroup(g.key)}
                className={`flex items-center gap-2 w-full text-left text-xs rounded-md px-2 py-1 transition ${on ? "hover:bg-slate-100" : "opacity-40 hover:opacity-70"}`}
              >
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-white shrink-0"
                  style={{ backgroundColor: g.color }}
                />
                <span className="text-slate-700">{g.label}</span>
                <span className="ml-auto text-slate-400">{g.markers.length}</span>
              </button>
            );
          })}
        </div>
      )}

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

      {/* Zoom + recentrer */}
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
        <div className="h-px bg-slate-200" />
        <button
          onClick={() => {
            setCenter(centerProp);
            setZ(zoom);
          }}
          className="p-1.5 hover:bg-slate-100 text-slate-700"
          title="Recentrer"
        >
          <Crosshair size={16} />
        </button>
      </div>

      {/* Panneau de détails (objet sélectionné) */}
      {selected && (
        <div className="absolute bottom-3 right-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderTopColor: selected.color }}
          >
            <span
              className="h-3 w-3 rounded-full ring-1 ring-white"
              style={{ backgroundColor: selected.color }}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {selected.title ?? "Objet"}
              </div>
              {selected.subtitle && (
                <div className="text-[11px] text-slate-500 truncate">{selected.subtitle}</div>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          </div>
          {selected.details && selected.details.length > 0 && (
            <div className="p-3 space-y-1.5">
              {selected.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{d.label}</span>
                  <span className="text-slate-800 font-medium text-right">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Légende */}
      {legend && legend.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 text-xs space-y-1 border border-slate-200 max-h-56 overflow-auto">
          <div className="font-semibold text-slate-700 mb-1">Légende</div>
          {legend.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full ring-1 ring-white"
                style={{ backgroundColor: l.color }}
              />
              <span className="text-slate-700">{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 text-[10px] text-slate-600 bg-white/70 px-1.5 py-0.5 rounded pointer-events-none">
        {LAYERS[layer].attribution}
      </div>
    </div>
  );
}

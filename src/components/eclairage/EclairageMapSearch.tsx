import { Search } from "lucide-react";

// Barre de recherche compacte flottante pour la vue carte (comme la MapSearchBar
// d'Espaces Verts) : ~w-96, en haut à gauche, pas pleine largeur.
export function EclairageMapSearch() {
  return (
    <div className="absolute top-4 left-4 z-30 w-[min(24rem,calc(100%-2rem))] pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl flex items-center p-1 border border-white/20 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-amber-500/50">
        <div className="p-2.5 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm font-medium h-9 min-w-0"
          placeholder="Rechercher sur la carte…"
        />
      </div>
    </div>
  );
}

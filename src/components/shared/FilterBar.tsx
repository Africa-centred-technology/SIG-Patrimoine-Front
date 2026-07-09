import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
}

// Barre de filtres standard : recherche + selects (children).
export function FilterBar({
  search,
  onSearch,
  placeholder = "Rechercher…",
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="text-sm border rounded-lg bg-white pl-9 pr-3 py-2 w-56 outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      {children}
    </div>
  );
}

// Select standardisé pour la barre de filtres.
export function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border rounded-lg bg-white px-3 py-2"
    >
      {children}
    </select>
  );
}

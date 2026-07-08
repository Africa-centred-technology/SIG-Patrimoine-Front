export type ThemeKey = "platform" | "espacesVerts" | "eclairage";

export interface ThemeTokens {
  key: ThemeKey;
  label: string;
  nav: string; // sidebar bg
  navBorder: string;
  surface: string;
  primaryBtn: string; // full class for button
  primaryText: string;
  activeItem: string;
  accentRing: string;
  accentText: string;
  spinner: string;
  gradient: string;
  navHover: string;
  logoBadge: string;
}

export const THEMES: Record<ThemeKey, ThemeTokens> = {
  platform: {
    key: "platform",
    label: "SIG Patrimoine",
    nav: "bg-slate-900",
    navBorder: "border-slate-800",
    surface: "bg-slate-800",
    primaryBtn:
      "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition",
    primaryText: "text-indigo-400",
    activeItem: "bg-indigo-500/20 text-white ring-1 ring-indigo-400/30",
    accentRing: "focus:ring-indigo-400",
    accentText: "text-indigo-400",
    spinner: "border-indigo-400",
    gradient: "bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950",
    navHover: "hover:bg-slate-800/60",
    logoBadge: "bg-indigo-600",
  },
  espacesVerts: {
    key: "espacesVerts",
    label: "Espaces Verts",
    nav: "bg-emerald-950",
    navBorder: "border-emerald-900",
    surface: "bg-emerald-900",
    primaryBtn:
      "bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition",
    primaryText: "text-emerald-500",
    activeItem: "bg-emerald-600/20 text-white ring-1 ring-emerald-400/30",
    accentRing: "focus:ring-emerald-400",
    accentText: "text-emerald-500",
    spinner: "border-emerald-400",
    gradient: "bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950",
    navHover: "hover:bg-emerald-900/60",
    logoBadge: "bg-emerald-700",
  },
  eclairage: {
    key: "eclairage",
    label: "Green Éclairage",
    nav: "bg-stone-900",
    navBorder: "border-stone-800",
    surface: "bg-stone-800",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/20 active:scale-[0.98] transition",
    primaryText: "text-amber-500",
    activeItem: "bg-amber-500/20 text-white ring-1 ring-amber-400/30",
    accentRing: "focus:ring-amber-400",
    accentText: "text-amber-400",
    spinner: "border-amber-400",
    gradient: "bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950",
    navHover: "hover:bg-stone-800/60",
    logoBadge: "bg-amber-500",
  },
};

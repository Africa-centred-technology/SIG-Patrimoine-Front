import { LUMINAIRES, ZONES } from "./mockData";

// ── Techniciens ─────────────────────────────────────────────────────────────
export type StatutTech = "DISPONIBLE" | "OCCUPE" | "CONGE" | "ASTREINTE";

export interface Technicien {
  id: string;
  nom: string;
  equipe: string;
  habilitations: string[];
  statut: StatutTech;
  interventionsMois: number;
  tel: string;
}

export const TECHNICIENS: Technicien[] = [
  { id: "tech-1", nom: "Hicham Amrani", equipe: "Réseau Nord", habilitations: ["B1", "B2", "BR"], statut: "DISPONIBLE", interventionsMois: 18, tel: "06 61 22 11 03" },
  { id: "tech-2", nom: "Salma Berrada", equipe: "Réseau Sud", habilitations: ["B1", "BR"], statut: "OCCUPE", interventionsMois: 21, tel: "06 62 33 44 55" },
  { id: "tech-3", nom: "Karim Fadili", equipe: "Maintenance", habilitations: ["B2", "BC", "BR"], statut: "DISPONIBLE", interventionsMois: 14, tel: "06 63 55 66 77" },
  { id: "tech-4", nom: "Nadia El Mansouri", equipe: "Astreinte", habilitations: ["B1", "BR"], statut: "ASTREINTE", interventionsMois: 9, tel: "06 64 77 88 99" },
  { id: "tech-5", nom: "Youssef Tahiri", equipe: "Réseau Nord", habilitations: ["B1", "B2", "BC", "BR"], statut: "CONGE", interventionsMois: 0, tel: "06 65 99 00 11" },
  { id: "tech-6", nom: "Imane Chraibi", equipe: "Maintenance", habilitations: ["B1", "BR"], statut: "DISPONIBLE", interventionsMois: 16, tel: "06 66 11 22 33" },
];

const seeded = (seed: number) => {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};

// ── Tâches de maintenance (planification) ───────────────────────────────────
export type TypeTacheMaint = "RELAMPING" | "RONDE" | "PREVENTIVE" | "CURATIVE" | "REMPLACEMENT";
export type StatutTache = "PLANIFIEE" | "EN_COURS" | "TERMINEE";

export interface TacheMaint {
  id: string;
  reference: string;
  titre: string;
  type: TypeTacheMaint;
  statut: StatutTache;
  priorite: 1 | 2 | 3 | 4 | 5;
  date: string;
  technicienId: string;
  zoneId: string;
  luminaireId?: string;
}

const TYPES_TACHE: TypeTacheMaint[] = ["RELAMPING", "RONDE", "PREVENTIVE", "CURATIVE", "REMPLACEMENT"];
const STATUTS_TACHE: StatutTache[] = ["PLANIFIEE", "PLANIFIEE", "EN_COURS", "TERMINEE", "TERMINEE"];
const TITRE_TACHE: Record<TypeTacheMaint, string> = {
  RELAMPING: "Relamping",
  RONDE: "Ronde de contrôle",
  PREVENTIVE: "Maintenance préventive",
  CURATIVE: "Maintenance curative",
  REMPLACEMENT: "Remplacement de luminaire",
};

export const TACHES_MAINT: TacheMaint[] = (() => {
  const rand = seeded(23);
  const out: TacheMaint[] = [];
  for (let i = 1; i <= 14; i++) {
    const type = TYPES_TACHE[Math.floor(rand() * TYPES_TACHE.length)];
    const zone = ZONES[Math.floor(rand() * ZONES.length)];
    const lum = LUMINAIRES[Math.floor(rand() * LUMINAIRES.length)];
    out.push({
      id: `tm-${i}`,
      reference: `MNT-2026-${String(i).padStart(3, "0")}`,
      titre: `${TITRE_TACHE[type]} — ${zone.nom}`,
      type,
      statut: STATUTS_TACHE[Math.floor(rand() * STATUTS_TACHE.length)],
      priorite: (1 + Math.floor(rand() * 5)) as 1 | 2 | 3 | 4 | 5,
      date: `2026-07-${String(1 + Math.floor(rand() * 27)).padStart(2, "0")}`,
      technicienId: TECHNICIENS[Math.floor(rand() * TECHNICIENS.length)].id,
      zoneId: zone.id,
      luminaireId: type === "REMPLACEMENT" || type === "CURATIVE" ? lum.id : undefined,
    });
  }
  return out;
})();

// ── Interventions réalisées ─────────────────────────────────────────────────
export type StatutInterv = "EN_COURS" | "TERMINEE";
export interface Intervention {
  id: string;
  reference: string;
  date: string;
  luminaireId: string;
  technicienId: string;
  type: string;
  statut: StatutInterv;
  duree_min: number;
  materiel: string[];
}

const MATERIEL = [
  ["Driver LED 60W"],
  ["Ballast", "Ampoule LED 70W"],
  ["Câblage", "Relamping complet"],
  ["Cellule photoélectrique"],
  ["Fusible", "Bornier"],
  ["Mât galvanisé", "Crosse"],
];

export const INTERVENTIONS: Intervention[] = (() => {
  const rand = seeded(51);
  const out: Intervention[] = [];
  for (let i = 1; i <= 12; i++) {
    const lum = LUMINAIRES[Math.floor(rand() * LUMINAIRES.length)];
    out.push({
      id: `int-${i}`,
      reference: `INT-2026-${String(i).padStart(3, "0")}`,
      date: `2026-07-${String(1 + Math.floor(rand() * 27)).padStart(2, "0")}`,
      luminaireId: lum.id,
      technicienId: TECHNICIENS[Math.floor(rand() * TECHNICIENS.length)].id,
      type: TITRE_TACHE[TYPES_TACHE[Math.floor(rand() * TYPES_TACHE.length)]],
      statut: rand() > 0.3 ? "TERMINEE" : "EN_COURS",
      duree_min: 20 + Math.floor(rand() * 100),
      materiel: MATERIEL[Math.floor(rand() * MATERIEL.length)],
    });
  }
  return out;
})();

export const techNom = (id: string) => TECHNICIENS.find((t) => t.id === id)?.nom ?? "—";

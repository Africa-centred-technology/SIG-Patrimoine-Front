import type { Luminaire, Panne, ZoneEclairage, ConsoMois } from "./types";

export const HEURE_ALLUMAGE = 18.5;
export const HEURE_EXTINCTION = 6.5;
export const HEURES_ALLUMAGE_JOUR = 12;
export const TARIF_KWH_MAD = 1.2;
export const FACTEUR_CO2 = 0.7; // kgCO2/kWh
export const SEUIL_ALERTE_PANNE = 0.1;
export const RATIO_SODIUM_EQUIV = 1.8;

export function estAllume(l: Luminaire, now: Date = new Date()): boolean {
  if (l.etat === "EN_PANNE" || l.etat === "MAINTENANCE" || l.etat === "VETUSTE") return false;
  const h = now.getHours() + now.getMinutes() / 60;
  return h >= HEURE_ALLUMAGE || h <= HEURE_EXTINCTION;
}

export function kWhJour(l: Luminaire): number {
  return (l.puissance_w / 1000) * HEURES_ALLUMAGE_JOUR;
}

export function kWhMois(l: Luminaire, nbJours = 30): number {
  return kWhJour(l) * nbJours;
}

export function consoTotaleMois(luminaires: Luminaire[], nbJours = 30): number {
  return luminaires.reduce((s, l) => s + kWhMois(l, nbJours), 0);
}

export function coutMAD(kwh: number): number {
  return kwh * TARIF_KWH_MAD;
}

export function tauxPanne(luminaires: Luminaire[]): number {
  if (!luminaires.length) return 0;
  return luminaires.filter((l) => l.etat === "EN_PANNE").length / luminaires.length;
}

export function tauxLED(luminaires: Luminaire[]): number {
  if (!luminaires.length) return 0;
  return luminaires.filter((l) => l.type === "LED").length / luminaires.length;
}

export function puissanceInstallee(luminaires: Luminaire[]): number {
  return luminaires.reduce((s, l) => s + l.puissance_w, 0) / 1000; // kW
}

export function economieVsSodium(luminaires: Luminaire[], nbJours = 30): number {
  // Référence : tout-sodium (LED × 1.8, non-LED restent tels quels)
  const consoRef = luminaires.reduce((s, l) => {
    const p = l.type === "LED" ? l.puissance_w * RATIO_SODIUM_EQUIV : l.puissance_w;
    return s + (p / 1000) * HEURES_ALLUMAGE_JOUR * nbJours;
  }, 0);
  const consoActuelle = consoTotaleMois(luminaires, nbJours);
  return Math.max(0, consoRef - consoActuelle);
}

export function co2Evite(economieKwh: number): number {
  return economieKwh * FACTEUR_CO2;
}

export function detecteAnomalies(luminaires: Luminaire[], now: Date = new Date()): Luminaire[] {
  const jour = now.getHours() >= 7 && now.getHours() <= 17;
  return luminaires.filter((l) => jour && l.etat === "ALLUME");
}

export function pannesOuvertes(pannes: Panne[]): Panne[] {
  return pannes.filter((p) => p.statut === "NOUVEAU" || p.statut === "EN_COURS");
}

export function consoParMois(conso: ConsoMois[], zones: ZoneEclairage[]) {
  const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return mois.map((m) => {
    const total = conso.filter((c) => c.mois === m).reduce((s, c) => s + c.kWh, 0);
    return { mois: m, kWh: total, cout: Math.round(total * TARIF_KWH_MAD) };
  });
}

import type {
  Tenant,
  Licence,
  Luminaire,
  EquipementElectrique,
  ZoneEclairage,
  Panne,
  ConsoMois,
  ProduitDef,
} from "./types";

export const CENTER = { lat: 32.216, lng: -7.937 };

// Catalogue initial des produits (paramétrable par le Super-Admin).
export const INITIAL_PRODUITS: ProduitDef[] = [
  {
    cle: "ESPACES_VERTS",
    nom: "Espaces Verts",
    description: "SIG de gestion du patrimoine végétal.",
    icone: "Trees",
    accentFrom: "from-emerald-700",
    accentTo: "to-emerald-950",
    actif: true,
    modules: [
      { cle: "dashboard", nom: "Tableau de bord", actif: true },
      { cle: "cartographie", nom: "Cartographie", actif: true },
      { cle: "inventaire", nom: "Inventaire", actif: true },
      { cle: "sites", nom: "Sites", actif: true },
      { cle: "clients", nom: "Clients", actif: true },
      { cle: "produits-phyto", nom: "Produits phyto", actif: true },
      { cle: "planification", nom: "Planification", actif: true },
      { cle: "reclamations", nom: "Réclamations", actif: true },
      { cle: "suivi-taches", nom: "Suivi des tâches", actif: true },
      { cle: "rh", nom: "RH / Équipes", actif: true },
      { cle: "rapports", nom: "Rapports", actif: true },
      { cle: "parametres", nom: "Paramètres", actif: true },
    ],
  },
  {
    cle: "ECLAIRAGE",
    nom: "Green Éclairage",
    description: "SIG de gestion du patrimoine d'éclairage public.",
    icone: "Lightbulb",
    accentFrom: "from-amber-500",
    accentTo: "to-stone-900",
    actif: true,
    modules: [
      { cle: "dashboard", nom: "Tableau de bord", actif: true },
      { cle: "cartographie", nom: "Cartographie", actif: true },
      { cle: "inventaire", nom: "Inventaire luminaires", actif: true },
      { cle: "zones", nom: "Zones / Secteurs", actif: true },
      { cle: "planification", nom: "Planification (maintenance)", actif: true },
      { cle: "pannes", nom: "Signalements de panne", actif: true },
      { cle: "interventions", nom: "Suivi des interventions", actif: true },
      { cle: "rh", nom: "RH / Techniciens", actif: true },
      { cle: "rapports", nom: "Rapports", actif: true },
      { cle: "parametres", nom: "Paramètres", actif: true },
    ],
  },
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: "t-benguerir",
    nom: "Commune de Benguérir",
    slug: "commune-benguerir",
    statut: "ACTIF",
    produits: ["ESPACES_VERTS", "ECLAIRAGE"],
    dateCreation: "2024-01-15",
    nbUtilisateurs: 18,
    nbSites: 12,
    contactNom: "Youssef Benali",
    contactEmail: "y.benali@benguerir.ma",
    ville: "Benguérir",
  },
  {
    id: "t-um6p",
    nom: "Université Mohammed VI Polytechnique (UM6P)",
    slug: "um6p",
    statut: "ACTIF",
    produits: ["ESPACES_VERTS", "ECLAIRAGE"],
    dateCreation: "2023-09-01",
    nbUtilisateurs: 42,
    nbSites: 28,
    contactNom: "Salma El Idrissi",
    contactEmail: "s.elidrissi@um6p.ma",
    ville: "Benguérir",
  },
  {
    id: "t-regie-marrakech",
    nom: "Régie des Espaces Verts de Marrakech",
    slug: "regie-ev-marrakech",
    statut: "ACTIF",
    produits: ["ESPACES_VERTS"],
    dateCreation: "2024-03-20",
    nbUtilisateurs: 22,
    nbSites: 15,
    contactNom: "Hicham Bennani",
    contactEmail: "h.bennani@marrakech.ma",
    ville: "Marrakech",
  },
  {
    id: "t-sdl-lumiere",
    nom: "SDL Marrakech Lumière",
    slug: "sdl-marrakech-lumiere",
    statut: "ACTIF",
    produits: ["ECLAIRAGE"],
    dateCreation: "2024-05-10",
    nbUtilisateurs: 14,
    nbSites: 8,
    contactNom: "Nadia Alaoui",
    contactEmail: "n.alaoui@marrakech-lumiere.ma",
    ville: "Marrakech",
  },
  {
    id: "t-green-city",
    nom: "Green City Mohammed VI",
    slug: "green-city",
    statut: "EN_ATTENTE",
    produits: ["ESPACES_VERTS", "ECLAIRAGE"],
    dateCreation: "2026-06-25",
    nbUtilisateurs: 3,
    nbSites: 2,
    contactNom: "Karim Fassi",
    contactEmail: "k.fassi@greencity.ma",
    ville: "Benguérir",
  },
  {
    id: "t-casa-eclairage",
    nom: "Régie Autonome d'Éclairage Public de Casablanca",
    slug: "raep-casa",
    statut: "SUSPENDU",
    produits: ["ECLAIRAGE"],
    dateCreation: "2023-02-01",
    nbUtilisateurs: 30,
    nbSites: 20,
    contactNom: "Omar Chraibi",
    contactEmail: "o.chraibi@raep-casa.ma",
    ville: "Casablanca",
  },
];

export const INITIAL_LICENCES: Licence[] = [
  {
    id: "l1",
    tenantId: "t-benguerir",
    produit: "ESPACES_VERTS",
    plan: "PRO",
    statut: "ACTIVE",
    seats: 25,
    seatsUtilises: 12,
    dateDebut: "2024-01-15",
    dateFin: "2026-12-31",
    prixMensuelMAD: 4900,
    renouvellementAuto: true,
  },
  {
    id: "l2",
    tenantId: "t-benguerir",
    produit: "ECLAIRAGE",
    plan: "PRO",
    statut: "ACTIVE",
    seats: 25,
    seatsUtilises: 6,
    dateDebut: "2024-01-15",
    dateFin: "2026-12-31",
    prixMensuelMAD: 4900,
    renouvellementAuto: true,
  },
  {
    id: "l3",
    tenantId: "t-um6p",
    produit: "ESPACES_VERTS",
    plan: "ENTERPRISE",
    statut: "ACTIVE",
    seats: 100,
    seatsUtilises: 32,
    dateDebut: "2023-09-01",
    dateFin: "2027-08-31",
    prixMensuelMAD: 12000,
    renouvellementAuto: true,
  },
  {
    id: "l4",
    tenantId: "t-um6p",
    produit: "ECLAIRAGE",
    plan: "ENTERPRISE",
    statut: "ACTIVE",
    seats: 100,
    seatsUtilises: 10,
    dateDebut: "2023-09-01",
    dateFin: "2027-08-31",
    prixMensuelMAD: 12000,
    renouvellementAuto: true,
  },
  {
    id: "l5",
    tenantId: "t-regie-marrakech",
    produit: "ESPACES_VERTS",
    plan: "PRO",
    statut: "ACTIVE",
    seats: 25,
    seatsUtilises: 22,
    dateDebut: "2024-03-20",
    dateFin: "2026-09-30",
    prixMensuelMAD: 4900,
    renouvellementAuto: false,
  },
  {
    id: "l6",
    tenantId: "t-sdl-lumiere",
    produit: "ECLAIRAGE",
    plan: "PRO",
    statut: "ACTIVE",
    seats: 25,
    seatsUtilises: 14,
    dateDebut: "2024-05-10",
    dateFin: "2027-05-09",
    prixMensuelMAD: 4900,
    renouvellementAuto: true,
  },
  {
    id: "l7",
    tenantId: "t-green-city",
    produit: "ESPACES_VERTS",
    plan: "STARTER",
    statut: "ESSAI",
    seats: 5,
    seatsUtilises: 2,
    dateDebut: "2026-06-25",
    dateFin: "2026-07-25",
    prixMensuelMAD: 0,
    renouvellementAuto: false,
  },
  {
    id: "l8",
    tenantId: "t-green-city",
    produit: "ECLAIRAGE",
    plan: "STARTER",
    statut: "ESSAI",
    seats: 5,
    seatsUtilises: 1,
    dateDebut: "2026-06-25",
    dateFin: "2026-07-25",
    prixMensuelMAD: 0,
    renouvellementAuto: false,
  },
  {
    id: "l9",
    tenantId: "t-casa-eclairage",
    produit: "ECLAIRAGE",
    plan: "PRO",
    statut: "EXPIREE",
    seats: 25,
    seatsUtilises: 30,
    dateDebut: "2023-02-01",
    dateFin: "2026-02-01",
    prixMensuelMAD: 4900,
    renouvellementAuto: false,
  },
];

// Générateur luminaires autour du centre
function jitter(base: number, amp = 0.008) {
  return base + (Math.random() - 0.5) * amp * 2;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const ZONES: ZoneEclairage[] = [
  {
    id: "z1",
    nom: "Centre-ville Benguérir",
    nb_luminaires: 12,
    puissance_totale_kw: 0.85,
    calendrier_allumage: "Crépuscule → Aube",
    coordinates: { lat: 32.216, lng: -7.937 },
  },
  {
    id: "z2",
    nom: "Zone industrielle Nord",
    nb_luminaires: 10,
    puissance_totale_kw: 1.2,
    calendrier_allumage: "Crépuscule → Aube",
    coordinates: { lat: 32.223, lng: -7.93 },
  },
  {
    id: "z3",
    nom: "Avenue Mohammed VI",
    nb_luminaires: 10,
    puissance_totale_kw: 0.95,
    calendrier_allumage: "Crépuscule → Aube",
    coordinates: { lat: 32.21, lng: -7.945 },
  },
  {
    id: "z4",
    nom: "Quartier résidentiel Sud",
    nb_luminaires: 8,
    puissance_totale_kw: 0.5,
    calendrier_allumage: "18h30 → 06h30",
    coordinates: { lat: 32.208, lng: -7.93 },
  },
];

const TYPES: Array<{ t: Luminaire["type"]; p: number }> = [
  { t: "LED", p: 60 },
  { t: "LED", p: 80 },
  { t: "SODIUM", p: 100 },
  { t: "SODIUM", p: 150 },
  { t: "PROJECTEUR", p: 200 },
  { t: "BORNE", p: 30 },
  { t: "APPLIQUE", p: 40 },
  { t: "GUIRLANDE", p: 25 },
];

const ETATS: Luminaire["etat"][] = [
  "ALLUME",
  "ALLUME",
  "ALLUME",
  "ALLUME",
  "ETEINT",
  "EN_PANNE",
  "MAINTENANCE",
  "VETUSTE",
];

// ── Rues (axes) : les luminaires bordent les voies, le réseau (câbles) court le
// long de ces axes. Approximation des voies autour de Benguérir / UM6P.
type LatLng = { lat: number; lng: number };
export interface Rue {
  id: string;
  nom: string;
  zoneId: string;
  n: number; // nb de luminaires le long de la voie
  path: LatLng[];
}

export const RUES: Rue[] = [
  {
    id: "r1",
    nom: "Avenue centrale",
    zoneId: "z1",
    n: 12,
    path: [
      { lat: 32.216, lng: -7.943 },
      { lat: 32.2162, lng: -7.94 },
      { lat: 32.2161, lng: -7.937 },
      { lat: 32.216, lng: -7.934 },
      { lat: 32.2159, lng: -7.931 },
    ],
  },
  {
    id: "r2",
    nom: "Rocade Nord (zone industrielle)",
    zoneId: "z2",
    n: 10,
    path: [
      { lat: 32.22, lng: -7.933 },
      { lat: 32.2215, lng: -7.9315 },
      { lat: 32.223, lng: -7.93 },
      { lat: 32.2245, lng: -7.9285 },
    ],
  },
  {
    id: "r3",
    nom: "Avenue Mohammed VI",
    zoneId: "z3",
    n: 10,
    path: [
      { lat: 32.213, lng: -7.944 },
      { lat: 32.2115, lng: -7.9445 },
      { lat: 32.21, lng: -7.945 },
      { lat: 32.2085, lng: -7.9455 },
    ],
  },
  {
    id: "r4",
    nom: "Rue résidentielle Sud",
    zoneId: "z4",
    n: 8,
    path: [
      { lat: 32.211, lng: -7.9325 },
      { lat: 32.2095, lng: -7.9312 },
      { lat: 32.208, lng: -7.93 },
      { lat: 32.2065, lng: -7.9288 },
    ],
  },
];

// Échantillonne `n` points régulièrement espacés le long d'une polyligne,
// avec un léger décalage perpendiculaire alterné (bord de voie).
function pointsAlong(path: LatLng[], n: number, side = 0.00009): LatLng[] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const d = Math.hypot(path[i].lat - path[i - 1].lat, path[i].lng - path[i - 1].lng);
    seg.push(d);
    total += d;
  }
  const out: LatLng[] = [];
  for (let k = 0; k < n; k++) {
    let target = (total * (k + 0.5)) / n;
    let i = 0;
    while (i < seg.length && target > seg[i]) {
      target -= seg[i];
      i++;
    }
    const a = path[Math.min(i, path.length - 2)];
    const b = path[Math.min(i + 1, path.length - 1)];
    const f = seg[i] ? target / seg[i] : 0;
    const lat = a.lat + (b.lat - a.lat) * f;
    const lng = a.lng + (b.lng - a.lng) * f;
    // perpendiculaire (approx) au segment, alternée
    const dx = b.lng - a.lng;
    const dy = b.lat - a.lat;
    const len = Math.hypot(dx, dy) || 1;
    const off = (k % 2 === 0 ? 1 : -1) * side;
    out.push({ lat: lat + (dx / len) * off, lng: lng - (dy / len) * off });
  }
  return out;
}

function buildLuminaires(): Luminaire[] {
  const rand = seededRandom(42);
  const out: Luminaire[] = [];
  RUES.forEach((rue) => {
    const pts = pointsAlong(rue.path, rue.n);
    pts.forEach((pt) => {
      const t = TYPES[Math.floor(rand() * TYPES.length)];
      const etat = ETATS[Math.floor(rand() * ETATS.length)];
      const n = out.length + 1;
      out.push({
        id: `lum-${n}`,
        reference: `LUM-${String(n).padStart(4, "0")}`,
        type: t.t,
        puissance_w: t.p,
        hauteur_feu_m: 6 + Math.floor(rand() * 5),
        etat,
        temperature_couleur_k: t.t === "LED" ? 4000 : 2700,
        date_pose: `202${1 + Math.floor(rand() * 4)}-0${1 + Math.floor(rand() * 9)}-15`,
        site_id: rue.zoneId,
        coordinates: pt,
      });
    });
  });
  return out;
}

export const LUMINAIRES: Luminaire[] = buildLuminaires();

export const RESEAU_ELEC: EquipementElectrique[] = [
  {
    id: "e1",
    reference: "ARM-001",
    type: "ARMOIRE",
    etat: "EN_SERVICE",
    puissance_kva: 40,
    nb_departs: 6,
    coordinates: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng) },
  },
  {
    id: "e2",
    reference: "ARM-002",
    type: "ARMOIRE",
    etat: "EN_SERVICE",
    puissance_kva: 25,
    nb_departs: 4,
    coordinates: { lat: 32.223, lng: -7.93 },
  },
  {
    id: "e3",
    reference: "ARM-003",
    type: "ARMOIRE",
    etat: "MAINTENANCE",
    puissance_kva: 30,
    nb_departs: 5,
    coordinates: { lat: 32.21, lng: -7.945 },
  },
  {
    id: "e4",
    reference: "TRF-001",
    type: "TRANSFORMATEUR",
    etat: "EN_SERVICE",
    puissance_kva: 160,
    coordinates: { lat: 32.22, lng: -7.94 },
  },
  {
    id: "e5",
    reference: "TRF-002",
    type: "TRANSFORMATEUR",
    etat: "EN_SERVICE",
    puissance_kva: 100,
    coordinates: { lat: 32.213, lng: -7.933 },
  },
  {
    id: "e6",
    reference: "CFT-001",
    type: "COFFRET",
    etat: "EN_SERVICE",
    coordinates: { lat: 32.217, lng: -7.939 },
  },
  {
    id: "e7",
    reference: "CFT-002",
    type: "COFFRET",
    etat: "HORS_SERVICE",
    coordinates: { lat: 32.208, lng: -7.93 },
  },
  {
    id: "e8",
    reference: "CPT-001",
    type: "COMPTEUR",
    etat: "EN_SERVICE",
    coordinates: { lat: 32.219, lng: -7.936 },
  },
  {
    id: "e9",
    reference: "CEL-001",
    type: "CELLULE_PHOTO",
    etat: "EN_SERVICE",
    coordinates: { lat: 32.214, lng: -7.938 },
  },
  {
    id: "e10",
    reference: "CEL-002",
    type: "CELLULE_PHOTO",
    etat: "EN_SERVICE",
    coordinates: { lat: 32.211, lng: -7.942 },
  },
];

function buildPannes(): Panne[] {
  const rand = seededRandom(7);
  const types: Panne["type"][] = [
    "LUMINAIRE_ETEINT",
    "POINT_NOIR",
    "CLIGNOTANT",
    "ARMOIRE_HS",
    "CABLE_ENDOMMAGE",
    "VANDALISME",
  ];
  const statuts: Panne["statut"][] = [
    "NOUVEAU",
    "NOUVEAU",
    "EN_COURS",
    "EN_COURS",
    "RESOLU",
    "CLOTURE",
  ];
  const out: Panne[] = [];
  for (let i = 1; i <= 15; i++) {
    const t = types[Math.floor(rand() * types.length)];
    const s = statuts[Math.floor(rand() * statuts.length)];
    // La panne est localisée sur un luminaire réel (donc sur une rue).
    const lum = LUMINAIRES[Math.floor(rand() * LUMINAIRES.length)];
    out.push({
      id: `pan-${i}`,
      reference: `PAN-2026-${String(i).padStart(4, "0")}`,
      type: t,
      statut: s,
      urgence: (1 + Math.floor(rand() * 5)) as 1 | 2 | 3 | 4 | 5,
      dateSignalement: `2026-0${1 + Math.floor(rand() * 6)}-${1 + Math.floor(rand() * 27)}`,
      description: descriptionPanne(t),
      coordinates: {
        lat: lum.coordinates.lat + (rand() - 0.5) * 0.0002,
        lng: lum.coordinates.lng + (rand() - 0.5) * 0.0002,
      },
      luminaireId: lum.id,
      zoneId: lum.site_id,
    });
  }
  return out;
}

function descriptionPanne(t: Panne["type"]) {
  switch (t) {
    case "LUMINAIRE_ETEINT":
      return "Luminaire éteint signalé par un riverain";
    case "POINT_NOIR":
      return "Zone entièrement non éclairée";
    case "CLIGNOTANT":
      return "Luminaire clignotant, probable ballast défectueux";
    case "ARMOIRE_HS":
      return "Armoire électrique hors service, secteur impacté";
    case "CABLE_ENDOMMAGE":
      return "Câble endommagé suite à travaux";
    case "VANDALISME":
      return "Acte de vandalisme sur mât d'éclairage";
  }
}

export const PANNES: Panne[] = buildPannes();

export const CONSO_ENERGIE: ConsoMois[] = (() => {
  const out: ConsoMois[] = [];
  const mois = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const rand = seededRandom(101);
  ZONES.forEach((z) => {
    mois.forEach((m) => {
      out.push({
        mois: m,
        zoneId: z.id,
        kWh: Math.round(z.puissance_totale_kw * 12 * 30 * (0.85 + rand() * 0.3)),
      });
    });
  });
  return out;
})();

// Espaces Verts mock minimal
export const EV_OBJETS = [
  {
    id: "ev1",
    ref: "ARB-001",
    type: "Arbre",
    espece: "Olivier",
    site: "Parc central",
    etat: "Bon",
  },
  {
    id: "ev2",
    ref: "ARB-002",
    type: "Arbre",
    espece: "Palmier dattier",
    site: "Avenue Mohammed VI",
    etat: "Bon",
  },
  {
    id: "ev3",
    ref: "GAZ-001",
    type: "Gazon",
    espece: "Bermuda",
    site: "Parc central",
    etat: "Moyen",
  },
  {
    id: "ev4",
    ref: "ARB-003",
    type: "Arbuste",
    espece: "Laurier rose",
    site: "Rond-point Est",
    etat: "Bon",
  },
  {
    id: "ev5",
    ref: "VIV-001",
    type: "Vivace",
    espece: "Lavande",
    site: "Parc central",
    etat: "Bon",
  },
  { id: "ev6", ref: "CAC-001", type: "Cactus", espece: "Opuntia", site: "Jardin sec", etat: "Bon" },
  {
    id: "ev7",
    ref: "PAL-001",
    type: "Palmier",
    espece: "Washingtonia",
    site: "Avenue Mohammed VI",
    etat: "Moyen",
  },
  {
    id: "ev8",
    ref: "ARB-004",
    type: "Arbre",
    espece: "Jacaranda",
    site: "Parc central",
    etat: "Bon",
  },
];

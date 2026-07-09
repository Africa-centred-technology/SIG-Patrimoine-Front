export type ProduitCle = "ESPACES_VERTS" | "ECLAIRAGE" | string;
export type PlanLicence = "STARTER" | "PRO" | "ENTERPRISE";

// ── Produits paramétrables ─────────────────────────────────────────────────
// Un produit du catalogue SIG Patrimoine est 100 % configurable par le
// Super-Admin : identité (nom, description, icône, couleurs), statut, et une
// liste de MODULES activables. Selon le tenant, on n'offre que les modules
// nécessaires.
export interface ModuleProduit {
  cle: string; // identifiant stable ("cartographie", "inventaire"...)
  nom: string;
  actif: boolean; // proposé par défaut à l'activation du produit
}

export interface ProduitDef {
  cle: ProduitCle; // identifiant du produit (ESPACES_VERTS, ECLAIRAGE, ou custom)
  nom: string;
  description: string;
  icone: string; // nom d'icône lucide (ex. "Trees", "Lightbulb", "Package")
  accentFrom: string; // classe gradient de début (ex. "from-emerald-700")
  accentTo: string; // classe gradient de fin (ex. "to-emerald-950")
  actif: boolean; // produit publié / disponible sur la plateforme
  modules: ModuleProduit[];
}
export type StatutLicence = "ESSAI" | "ACTIVE" | "EXPIREE" | "SUSPENDUE";
export type StatutTenant = "ACTIF" | "SUSPENDU" | "EN_ATTENTE";
export type Role = "SUPERADMIN" | "TENANT_ADMIN" | "SUPERVISEUR" | "AGENT" | "CLIENT";

export interface Licence {
  id: string;
  tenantId: string;
  produit: ProduitCle;
  plan: PlanLicence;
  statut: StatutLicence;
  seats: number;
  seatsUtilises: number;
  dateDebut: string;
  dateFin: string;
  prixMensuelMAD: number;
  renouvellementAuto: boolean;
}

export interface Tenant {
  id: string;
  nom: string;
  slug: string;
  statut: StatutTenant;
  produits: ProduitCle[];
  dateCreation: string;
  nbUtilisateurs: number;
  nbSites: number;
  contactNom: string;
  contactEmail: string;
  ville: string;
}

export type EtatLuminaire = "ALLUME" | "ETEINT" | "EN_PANNE" | "MAINTENANCE" | "VETUSTE";
export type TypeLuminaire = "LED" | "SODIUM" | "PROJECTEUR" | "BORNE" | "APPLIQUE" | "GUIRLANDE";

export interface Luminaire {
  id: string;
  reference: string;
  type: TypeLuminaire;
  puissance_w: number;
  hauteur_feu_m?: number;
  etat: EtatLuminaire;
  temperature_couleur_k?: number;
  date_pose?: string;
  site_id: string;
  coordinates: { lat: number; lng: number };
}

export type TypeEquipElec =
  | "ARMOIRE"
  | "LIGNE"
  | "COFFRET"
  | "TRANSFORMATEUR"
  | "COMPTEUR"
  | "CELLULE_PHOTO";

export interface EquipementElectrique {
  id: string;
  reference: string;
  type: TypeEquipElec;
  etat: "EN_SERVICE" | "HORS_SERVICE" | "MAINTENANCE";
  puissance_kva?: number;
  nb_departs?: number;
  coordinates: { lat: number; lng: number };
}

export interface ZoneEclairage {
  id: string;
  nom: string;
  nb_luminaires: number;
  puissance_totale_kw: number;
  calendrier_allumage: string;
  coordinates: { lat: number; lng: number };
}

export type StatutPanne = "NOUVEAU" | "EN_COURS" | "RESOLU" | "CLOTURE";
export type TypePanne =
  | "LUMINAIRE_ETEINT"
  | "POINT_NOIR"
  | "CLIGNOTANT"
  | "ARMOIRE_HS"
  | "CABLE_ENDOMMAGE"
  | "VANDALISME";

export interface Panne {
  id: string;
  reference: string;
  type: TypePanne;
  statut: StatutPanne;
  urgence: 1 | 2 | 3 | 4 | 5;
  dateSignalement: string;
  description: string;
  coordinates: { lat: number; lng: number };
  luminaireId?: string;
  zoneId?: string;
}

export interface ConsoMois {
  mois: string;
  zoneId: string;
  kWh: number;
}

# SIG Patrimoine — Spécification complète pour Lovable

> **Objectif de ce document**
> Générer avec **Lovable** un **frontend simulé** (mock data, **aucun backend réel**) d'une plateforme SaaS **multi-tenant** nommée **SIG Patrimoine**, qui regroupe **deux produits** :
>
> 1. **GreenSIG — Espaces Verts** (produit existant, à reprendre à l'identique : design, couleurs, polices, modules).
> 2. **GreenSIG — Green Éclairage** (nouveau produit à concevoir, symétrique au premier, adapté à l'éclairage public / patrimoine électrique).
>
> Tout doit être **simulé côté frontend** : authentification factice, données en mémoire (mock), navigation complète, aucun appel API à implémenter. Ce fichier est rédigé pour être **collé tel quel dans Lovable** (ou découpé section par section).

---

## 0. Résumé exécutif (à lire en premier)

**SIG Patrimoine** est la marque « parapluie ». C'est un SIG (Système d'Information Géographique) de gestion de patrimoine territorial, décliné en **produits** métier.

- **Le Super-Administrateur SIG Patrimoine** crée des **tenants** (organisations clientes) et leur **attribue** l'accès à un ou plusieurs produits (Espaces Verts et/ou Green Éclairage).
- **Chaque tenant** (une commune, une entreprise, un gestionnaire d'espaces) administre ensuite **son propre espace** de façon autonome : il crée ses utilisateurs, ses équipes, ses **agents** de terrain, et gère son patrimoine sur le(s) produit(s) auxquels il a accès.
- **Architecture cible réelle** (à documenter mais **pas à coder** ici) : base de données unique, **isolation par schéma tenant** (schema-per-tenant dynamique). Les tenants sont provisionnés dynamiquement par le Super-Admin.
- **Ce livrable Lovable** = simulation frontend de cette expérience de bout en bout.

### Les 3 niveaux d'expérience à générer

| Niveau | Persona | Ce qu'il voit |
|--------|---------|---------------|
| **Plateforme** | Super-Admin SIG Patrimoine | Console de gestion des tenants, attribution des produits, licences, statistiques globales |
| **Tenant** | Admin de l'organisation | Sélecteur de produit (Espaces Verts / Éclairage), puis administration complète de son espace |
| **Métier** | Superviseur / Agent / Client | Modules opérationnels du produit choisi (carte, inventaire, planning, réclamations, etc.) |

---

## 1. Design System (repris de l'existant — À RESPECTER STRICTEMENT)

Le produit Espaces Verts existe déjà. Le nouveau produit et la couche plateforme **doivent réutiliser exactement** ce langage visuel pour garantir la cohérence de marque.

### 1.1 Stack de style

- **Tailwind CSS** (utility-first). Pas de fichier de config custom nécessaire : classes standard Tailwind.
- **Icônes** : `lucide-react` uniquement.
- **Police** : pile système — `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Pas de webfont externe (performance + rendu natif).
- **Langue de l'UI** : **Français**.

### 1.2 Trois identités visuelles distinctes (RÈGLE FONDAMENTALE)

Le système comporte **trois territoires de couleur distincts**. Chaque territoire a sa propre couleur de marque. **Ne jamais mélanger** : la couleur du chrome (sidebar, boutons primaires, en-tête, login) suit le contexte où se trouve l'utilisateur.

| Territoire | Contexte | Couleur de marque | Ambiance |
|------------|----------|-------------------|----------|
| **SIG Patrimoine** (plateforme) | Login, console Super-Admin, sélecteur de produit/tenant | **Indigo / Ardoise** (NOUVEAU) | Institutionnel, tech, premium |
| **Espaces Verts** (produit 1) | Toute l'app Espaces Verts | **Emerald** (existant, inchangé) | Végétal, nature |
| **Green Éclairage** (produit 2) | Toute l'app Éclairage | **Ambre / Nuit** (NOUVEAU) | Lumière, énergie, nocturne |

> **Comportement attendu** : quand on entre dans un produit, tout le chrome (sidebar, boutons, focus, spinner, badges d'en-tête) **bascule** vers la couleur du produit. Quand on revient sur la plateforme (console tenants, sélecteur), le chrome redevient **Indigo/Ardoise**. C'est le signal visuel du multi-produit.

#### 1.2.a — SIG Patrimoine · plateforme (NOUVEAU code couleur de marque)

Palette **Indigo & Ardoise** : neutre, sérieuse, distincte des deux produits verts/ambre. C'est l'identité de la **maison mère** (gestion de patrimoine, console d'administration des tenants).

| Rôle | Classe Tailwind | Hex | Usage |
|------|-----------------|-----|-------|
| Fond profond / sidebar | `slate-900` | `#0f172a` | Sidebar plateforme, fond login, headers sombres |
| Surface secondaire | `slate-800` | `#1e293b` | Cartes sombres, bandeaux |
| Action principale | `indigo-600` | `#4f46e5` | Boutons primaires plateforme |
| Hover action | `indigo-700` | `#4338ca` | Hover boutons |
| État actif nav | `indigo-500` | `#6366f1` | Item de menu actif |
| Accent clair | `indigo-400` | `#818cf8` | Spinner, focus, accents |
| Accent secondaire | `violet-400` | `#a78bfa` | Touches décoratives (dégradés, blobs login) |
| Neutres | `slate-50` → `slate-900` | — | Textes, bordures, fonds de contenu |
| Fonds de contenu | `white`, `slate-50`, `slate-200` | — | Cartes, tableaux, bordures |

Dégradé de marque (login/console) : `from-indigo-900 via-slate-900 to-slate-950`.

#### 1.2.b — Espaces Verts · produit 1 (EXISTANT, inchangé)

Palette **Emerald** — reprise **strictement** de l'application actuelle.

| Rôle | Classe Tailwind | Hex | Usage |
|------|-----------------|-----|-------|
| Fond profond / sidebar | `emerald-950` | `#022c22` | Sidebar, headers sombres |
| Surface secondaire | `emerald-900` | `#064e3b` | Header cartes, bandeaux |
| Action principale | `emerald-700` | `#047857` | Boutons primaires |
| Hover action | `emerald-800` | `#065f46` | Hover boutons |
| État actif nav | `emerald-600` | `#059669` | Item de menu actif |
| Accent clair | `emerald-400` | `#4ade80` | Spinner, focus, accents |
| Accent secondaire | `lime-400` | `#a3e635` | Touches décoratives |

#### 1.2.c — Green Éclairage · produit 2 (NOUVEAU code couleur de marque)

Palette **Ambre & Nuit** : la lumière (ambre chaud) sur un chrome sombre nocturne (stone/charbon), avec le bleu comme accent « réseau électrique ». Identité clairement différente d'Espaces Verts.

| Rôle | Classe Tailwind | Hex | Usage |
|------|-----------------|-----|-------|
| Fond profond / sidebar | `stone-900` | `#1c1917` | Sidebar nocturne, headers sombres |
| Surface secondaire | `stone-800` | `#292524` | Cartes sombres, bandeaux |
| Action principale | `amber-500` | `#f59e0b` | Boutons primaires |
| Hover action | `amber-600` | `#d97706` | Hover boutons |
| État actif nav | `amber-500` | `#f59e0b` | Item de menu actif |
| Accent clair | `amber-400` | `#fbbf24` | Spinner, focus, halo lumineux |
| Accent secondaire | `sky-500` | `#0ea5e9` | Réseau électrique, liens data |
| Neutres | `stone-50` → `stone-900` | — | Textes, bordures, fonds |

Dégradé de marque (login/dashboard éclairage) : `from-amber-900 via-stone-900 to-stone-950`.

> Astuce d'implémentation : définir un objet `theme` par contexte (`platform` / `espacesVerts` / `eclairage`) avec les clés `{ nav, surface, primary, primaryHover, active, accent }`, exposé via `ThemeContext`, et piloter les classes Tailwind à partir de là. Le chrome lit le thème du contexte courant.

### 1.3 Palettes sémantiques métier — voir §1.4

Les couleurs **métier** (types d'objets sur la carte) sont indépendantes des trois identités de marque : ce sont des codes de légende. Voir §1.4.

### 1.4 Palettes sémantiques métier (légendes carto)

**Espaces Verts — Végétation (existant, à conserver) :**

| Type | Hex |
|------|-----|
| Arbre | `#059669` |
| Gazon | `#84cc16` |
| Palmier | `#f97316` |
| Arbuste | `#10b981` |
| Vivace | `#ec4899` |
| Cactus | `#06b6d4` |
| Graminée | `#eab308` |

**Espaces Verts — Hydraulique (existant, à conserver) :** dégradé de bleus/cyans `#0ea5e9`, `#06b6d4`, `#14b8a6`, `#0891b2`, `#0284c7`, `#38bdf8`, `#7dd3fc`, `#0369a1`.

**Green Éclairage — Points lumineux (NOUVEAU) :**

| Type | Hex | Note |
|------|-----|------|
| Lampadaire LED | `#f59e0b` | Ambre |
| Lampadaire Sodium (SHP) | `#f97316` | Orange chaud |
| Projecteur | `#eab308` | Jaune |
| Borne lumineuse | `#fbbf24` | Ambre clair |
| Applique murale | `#fcd34d` | Jaune pâle |
| Guirlande / Festif | `#a78bfa` | Violet (décoratif) |

**Green Éclairage — Réseau électrique (NOUVEAU) :**

| Type | Hex |
|------|-----|
| Armoire électrique | `#0369a1` |
| Ligne / Câble | `#0284c7` |
| Coffret de raccordement | `#0ea5e9` |
| Transformateur | `#075985` |
| Compteur | `#38bdf8` |
| Cellule photoélectrique | `#7dd3fc` |

### 1.5 Statuts (couleurs communes réutilisables)

| Statut | Hex | Sens |
|--------|-----|------|
| Nouveau / Urgent | `#ef4444` (red-500) | En attente |
| En cours | `#f97316` (orange-500) | En traitement |
| Résolu / OK | `#22c55e` (green-500) | Terminé |
| En validation | `#10b981` (emerald-500) | En attente client |
| Rejeté / Inactif | `#6b7280` (gray-500) | Clos sans suite |

**Statuts spécifiques Green Éclairage :** `Allumé` (`#22c55e`), `Éteint` (`#64748b`), `En panne` (`#ef4444`), `Maintenance` (`#f97316`), `Vétuste` (`#a16207`).

### 1.6 Composants & tokens visuels (à répliquer)

> **Important** : les tokens ci-dessous décrivent la **forme** des composants (rayons, ombres, structure, transitions) — identique partout. Seule la **couleur** change selon le thème du contexte (§1.2 : Indigo plateforme / Emerald Espaces Verts / Ambre Éclairage). Les exemples sont donnés avec la couleur **Espaces Verts** (existant) ; remplacer `emerald-*` par `indigo-*`/`slate-*` sur la plateforme et par `amber-*`/`stone-*` sur l'éclairage.

- **Rayons** : cartes `rounded-lg` / `rounded-xl`, modales `rounded-2xl`, badges `rounded-full`, boutons `rounded-lg`.
- **Ombres** : `shadow-sm` (cartes), `shadow-2xl` (sidebar, modales, login).
- **Sidebar** : `bg-{nav}/95 backdrop-blur-md` (ex. `emerald-950`, ou `slate-900`/`stone-900` selon thème), largeur `260px` (déployée) / `72px` (repliée), item actif `bg-{active} ... ring-1 ring-{accent}/20` + puce blanche à droite, hover `bg-{surface}/30`. Transition `300ms cubic-bezier(0.25,0.8,0.25,1)`.
- **Boutons primaires** : `bg-{primary} hover:bg-{primaryHover} text-white font-bold rounded-lg ... active:scale-[0.98] shadow-lg shadow-{primary}/20`.
- **Champs de formulaire** : `border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-{accent}`, icône `lucide` à gauche en `{primary}/50`.
- **Cartes de contenu** : `bg-white rounded-lg border border-gray-200`.
- **Cartes de statistiques (StatCard)** : pastille d'icône ronde colorée + label + valeur (voir module Produits existant).
- **Badges de statut (StatusBadge)** : pilule `rounded-full text-xs font-medium` colorée selon statut.
- **Tableaux (DataTable)** : générique, triable, paginé (15/page), lignes cliquables, colonne d'actions avec dropdown.
- **Spinner de chargement** : anneau `emerald-400` rotatif, label « CHARGEMENT ».
- **Scrollbar custom** : fine (4–6px), translucide.
- **Animations** : `animate-slide-in` (entrée douce), `active:scale-[0.98]` au clic.

---

## 2. Architecture multi-tenant (à SIMULER)

> **Réel (documentation, non codé)** : une seule base PostgreSQL/PostGIS, **isolation par schéma** (`schema-per-tenant`), provisionnement **dynamique** d'un nouveau schéma à la création d'un tenant. Chaque tenant ne voit que ses données.
>
> **Simulé (Lovable)** : un `TenantContext` en mémoire. Le tenant courant filtre toutes les données mock. Changer de tenant recharge des jeux de données mock différents. Aucune persistance requise (ou `localStorage` pour le confort de démo).

### 2.1 Modèle de données simulé

```ts
// Tenant = organisation cliente créée par le Super-Admin
interface Tenant {
  id: string;
  nom: string;                 // ex. "Commune de Benguérir"
  slug: string;                // "commune-benguerir"
  logo?: string;
  statut: 'ACTIF' | 'SUSPENDU' | 'EN_ATTENTE';
  produits: ProduitCle[];      // produits attribués : ['ESPACES_VERTS', 'ECLAIRAGE']
  licences: Licence[];         // une licence par produit attribué (cf. §2.4)
  dateCreation: string;
  nbUtilisateurs: number;
  nbSites: number;
  contactNom: string;
  contactEmail: string;
  ville: string;
}

type ProduitCle = 'ESPACES_VERTS' | 'ECLAIRAGE';

interface Produit {
  cle: ProduitCle;
  nom: string;                 // "Espaces Verts" | "Green Éclairage"
  description: string;
  accent: string;              // classe/hex d'accent produit
  icone: string;               // nom d'icône lucide
}

// Licence = droit d'usage d'UN produit par un tenant (créée par le Super-Admin
// lors de l'attribution). Prépare l'achat/abonnement en libre-service (§2.4).
type PlanLicence = 'STARTER' | 'PRO' | 'ENTERPRISE';

interface Licence {
  id: string;
  tenantId: string;
  produit: ProduitCle;
  plan: PlanLicence;
  statut: 'ESSAI' | 'ACTIVE' | 'EXPIREE' | 'SUSPENDUE';
  seats: number;               // nb d'utilisateurs autorisés
  seatsUtilises: number;
  dateDebut: string;
  dateFin: string;             // date d'expiration
  prixMensuelMAD: number;      // tarif du plan (MAD/mois)
  renouvellementAuto: boolean;
}
```

### 2.2 Rôles & permissions (extension de l'existant)

L'existant a `ADMIN | SUPERVISEUR | CLIENT`. On **ajoute deux niveaux plateforme** au-dessus :

| Rôle | Portée | Peut faire |
|------|--------|-----------|
| `SUPERADMIN` | Plateforme (cross-tenant) | Créer/suspendre des tenants, attribuer les produits, voir stats globales, gérer licences. **Ne gère pas** le métier d'un tenant. |
| `TENANT_ADMIN` | Un tenant | Administrer son organisation : utilisateurs, équipes, agents, choisir/utiliser ses produits, tous les modules métier. (≈ l'ancien `ADMIN`, scopé au tenant.) |
| `SUPERVISEUR` | Un tenant | Gère planning, équipes, opérations terrain sur les produits du tenant. |
| `AGENT` | Un tenant | Agent de terrain : consulte ses tâches, exécute, saisit le suivi. (Vue mobile-first souhaitable.) |
| `CLIENT` | Un tenant | Portail lecture seule : carte, réclamations, rapports de son périmètre. |

> Note : garder les libellés existants côté produit. `TENANT_ADMIN` remplace fonctionnellement `ADMIN` à l'intérieur d'un tenant.

### 2.3 Écran de connexion = ACCÈS DÉMO (sans mot de passe)

> **Démo frontend réelle, sans backend** : la page de login **n'a PAS de formulaire email/mot de passe**. C'est un **sélecteur d'accès** qui affiche **uniquement deux choses** :
>
> 1. **L'Administrateur SIG Patrimoine** (le Super-Admin de la plateforme) — une carte/bouton dédié, thème Indigo.
> 2. **La liste des organisations** (les tenants existants, issus du mock `mockTenants.ts`) — sous forme de cartes cliquables.

```
Écran de connexion (démo, aucun mot de passe)
┌────────────────────────────────────────────────────────────────┐
│  [ Logo SIG Patrimoine ]                                        │
│                                                                 │
│  ┌───────────────────────────────────────────────┐             │
│  │  🛡  Administrateur SIG Patrimoine             │  → clic →   │  Console Plateforme
│  │     Gérer les organisations, produits, licences│             │  (/platform/...)
│  └───────────────────────────────────────────────┘             │
│                                                                 │
│  ── Ou entrer dans une organisation ──                          │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Commune de   │ │ UM6P          │ │ Régie EV     │  → clic →  │  Sélecteur de PRODUIT
│  │ Benguérir    │ │ (Enterprise)  │ │ Marrakech    │            │  du tenant → app métier
│  │ EV + Éclair. │ │ EV + Éclair.  │ │ EV           │            │
│  │ ✅ Actif      │ │ ✅ Actif       │ │ ✅ Actif      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ SDL Marrakech│ │ Green City    │ │ Régie Casa   │            │
│  │ Lumière      │ │ Mohammed VI   │ │ Éclairage    │            │
│  │ Éclairage    │ │ ⏳ Essai      │ │ 🔒 Expirée   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

**Comportement :**

- **Clic sur « Administrateur SIG Patrimoine »** → entre dans la **Console Plateforme** (rôle `SUPERADMIN`, thème Indigo).
- **Clic sur une organisation** → entre **dans ce tenant** en tant que `TENANT_ADMIN` (persona par défaut de la démo), thème du/des produit(s) → **sélecteur de produit** puis application métier.
- Chaque carte d'organisation affiche : **logo/initiales**, **nom**, **ville**, **badges produits** (EV / Éclairage), et l'**état de licence** (✅ Actif, ⏳ Essai, 🔒 Expirée/verrouillée). Une organisation à licence **expirée** est cliquable mais mène à l'écran **produit verrouillé** (CTA « Renouveler »).
- Les organisations **créées par le Super-Admin** dans la console apparaissent **aussi** dans cette liste (état partagé via contexte / `localStorage`), ce qui boucle la démo : créer un tenant côté admin → il devient sélectionnable au login.

> **Sélecteur de produit** (après entrée dans un tenant) : écran 2 grandes cartes produit OU switcher persistant en haut de la sidebar. Ne montrer que les produits **sous licence active/essai**. Basculer de produit change layout + thème + URL, mais conserve tenant + persona.

### 2.4 Attribution des produits & Licences (piloté par le SUPER-ADMIN)

> **Règle métier** : c'est **exclusivement le SUPER-ADMIN**, depuis **sa console plateforme**, qui attribue un produit à un tenant. **Attribuer un produit = créer une Licence** pour ce produit chez ce tenant. Un tenant **ne voit et n'utilise** que les produits pour lesquels il détient une **licence active** (ou en essai). Aucun tenant ne peut s'auto-attribuer un produit dans cette version.

**Flux d'attribution (simulé) :**

1. Le Super-Admin ouvre le **détail d'un tenant** (`/platform/tenants/:id`).
2. Section **« Produits & Licences »** : pour chaque produit (Espaces Verts / Green Éclairage) → bouton **« Attribuer »** si non détenu, sinon carte de licence (plan, seats, expiration, statut).
3. **Attribuer** ouvre une modale : choix du **plan** (Starter / Pro / Enterprise), **nombre de seats**, **date de début/fin**, **renouvellement auto**. Valider → crée la `Licence` et ajoute la clé produit à `tenant.produits`.
4. Le Super-Admin peut ensuite **suspendre**, **prolonger**, **changer de plan** ou **révoquer** la licence. Révoquer retire le produit du tenant.

**Effet côté tenant :** au prochain login du `TENANT_ADMIN`, le sélecteur de produit affiche uniquement les produits sous **licence active/essai**. Une licence `EXPIREE`/`SUSPENDUE` → le produit apparaît **verrouillé** (cadenas + CTA « Renouveler »).

**Grille de plans (mock, à afficher) :**

| Plan | Cible | Seats inclus | Prix indicatif |
|------|-------|--------------|----------------|
| `STARTER` | Petite commune / essai | 5 | 0 MAD (essai 30 j) |
| `PRO` | Commune / gestionnaire | 25 | 4 900 MAD / mois |
| `ENTERPRISE` | Grande ville / multi-sites | Illimité | Sur devis |

### 2.5 Achat de licence en libre-service (PRÉPARÉ — écran mock)

Anticipe l'évolution « self-service » : une page **`/platform/billing`** (et un CTA « Renouveler / Souscrire » côté tenant verrouillé) affichant les **3 cartes de plans**, un récapitulatif (produit, seats, total mensuel MAD), et un bouton **« Procéder au paiement »** → **écran de paiement factice** (formulaire carte mock, pas de vraie transaction) qui, une fois « payé », **active la licence**. Aucune intégration de paiement réelle : c'est une **simulation** posant l'ossature pour un futur branchement (Stripe/CMI).

### 2.6 Accès admin à l'espace d'un tenant (impersonation + BASCULE DE MENU)

> **Besoin** : depuis la console, le Super-Admin doit pouvoir **ouvrir un tenant, consulter ses détails, puis ENTRER dans son espace produit** pour voir exactement ce que voit le tenant. **En entrant, tout le menu (sidebar) change** : on quitte le menu Plateforme (Indigo) pour le **menu métier du produit** (Emerald pour Espaces Verts, Ambre pour Green Éclairage).

**Parcours :**

```
/platform/tenants  (liste : nom, ville, badges produits, statut licence, nb users/sites)
        │  clic sur une ligne
        ▼
/platform/tenants/:id  (DÉTAIL tenant)
   ├─ En-tête : logo, nom, ville, statut, contact
   ├─ Cartes de stats : nb utilisateurs, nb sites, produits actifs, licences
   ├─ Section « Produits & Licences » : une carte par produit détenu
   │     (plan, seats utilisés/total, expiration, statut)
   │     + bouton « Attribuer » si produit non détenu
   └─ Chaque carte produit a un bouton  ▶ « Accéder à l'espace »
              │  clic
              ▼
   Espace métier du tenant (impersonation) :
   - LA SIDEBAR CHANGE : menu du produit (Emerald ou Ambre) au lieu du menu Plateforme.
   - L'URL passe à /espaces-verts/... ou /eclairage/... (préfixe tenant courant).
   - Un BANDEAU permanent en haut : « 👁 Mode admin — vous consultez l'espace de
     [Nom du tenant] »  +  bouton « ⟵ Revenir à la console ».
   - L'admin voit et navigue dans TOUS les modules du produit avec les données du tenant.
```

**Règles :**

- **Changement de menu = changement de layout + de thème** : entrer dans l'espace tenant monte `EspacesVertsLayout` (thème Emerald) ou `EclairageLayout` (thème Ambre), avec **leur** sidebar de modules. Sortir (« Revenir à la console ») remonte `PlatformLayout` (thème Indigo, menu plateforme).
- L'état d'impersonation vit dans un contexte (`impersonatedTenantId` + `activeProduct`). Le **bandeau admin** reste visible tant qu'on est dans l'espace tenant.
- Si le produit visé est **verrouillé** (licence expirée/suspendue), l'admin voit l'écran verrouillé + peut aller sur `/platform/billing` pour réactiver.
- Depuis le sélecteur de produit d'un tenant multi-produits, l'admin choisit lequel des deux espaces ouvrir.
- Différence avec le login organisation (§2.3) : au login, on entre comme `TENANT_ADMIN` réel ; ici, c'est le `SUPERADMIN` qui **impersonne** un tenant depuis sa console, avec le bandeau et le retour console.

---

## 3. Navigation & arborescence

### 3.1 Console Plateforme (SUPERADMIN)

```
/platform
  /platform/dashboard      → KPIs globaux (nb tenants, produits actifs, licences, MRR)
  /platform/tenants        → Liste des tenants (tableau) + création
  /platform/tenants/:id    → Détail tenant : produits & licences, users, statut
  /platform/products       → Catalogue des 2 produits (Espaces Verts / Éclairage)
  /platform/licences       → Toutes les licences (statut, expiration, seats, plan)
  /platform/billing        → Grille de plans + paiement mock (achat/renouvellement)
  /platform/settings       → Paramètres plateforme
```

### 3.2 Application produit — Espaces Verts (existant, à reprendre)

Sidebar (emerald), modules déjà développés :

```
/dashboard        Tableau de bord (KPIs, tâches récentes, réclamations)
/map              Cartographie (OpenLayers-like : couches végétation/hydraulique/sites)
/inventory        Inventaire (arbres, gazon, palmiers... 15 types)
/sites            Gestion des sites (et sous-sites/villas)
/clients          Clients (structures clientes) — TENANT_ADMIN
/products          Gestion de produits phyto (phytosanitaires, fertilisants, ravageurs)
/planning         Planification des tâches (calendrier, récurrence)
/reclamations     Réclamations (cycle de vie, SLA, localisation)
/suivi-taches     Suivi des tâches (produits, photos, consommations)
/teams            RH (équipes, opérateurs, compétences, absences)
/reporting        Rapports (mensuel, hebdo, export PDF/Excel)
/parametres       Paramètres (types de tâches, ratios, horaires, jours fériés)
```

### 3.3 Application produit — Green Éclairage (NOUVEAU — symétrique)

```
/eclairage/dashboard      Tableau de bord éclairage (points lumineux, pannes, conso)
/eclairage/map            Cartographie du réseau lumineux + électrique
/eclairage/inventory      Inventaire des luminaires & équipements
/eclairage/sites          Zones / secteurs d'éclairage
/eclairage/planning       Planification maintenance (relamping, rondes)
/eclairage/reclamations   Signalements de panne (point noir, luminaire éteint)
/eclairage/interventions  Suivi des interventions électriques
/eclairage/energie        Consommation énergétique & performance (NOUVEAU/spécifique)
/eclairage/teams          RH / Techniciens & agents
/eclairage/reporting      Rapports (conso, taux de panne, bilan carbone)
/eclairage/parametres     Paramètres (types de luminaires, calendriers d'allumage)
```

---

## 4. Produit 1 — Espaces Verts (à reprendre à l'identique)

Ce produit existe déjà. Dans le livrable Lovable, il faut **reproduire son apparence et ses modules** avec des **données mock**. Résumé fonctionnel de chaque module :

- **Dashboard** : cartes KPI (nb objets, tâches du mois, réclamations, taux de réalisation), liste des tâches récentes, réclamations récentes, mini-graphiques (Recharts-like).
- **Cartographie** : carte plein écran, sélecteur de fond (Plan / Satellite / Relief / Navigation), couches activables (végétation, hydraulique, sites, réclamations), légende colorée, outils (mesure, sélection), clustering.
- **Inventaire** : tableau unifié des 15 types d'objets, filtres par type et par site, détail par objet.
- **Sites** : liste + détail (surface, centroïde, sous-sites/villas).
- **Planification** : calendrier des tâches (type, priorité 1–5, statut PLANIFIÉE→EN_COURS→TERMINÉE), récurrence, affectation d'opérateurs.
- **Réclamations** : numéro auto `REC-AAAA-XXXX`, statut, urgence/SLA, localisation ponctuelle, cycle de vie.
- **Suivi des tâches** : produits phyto consommés, photos avant/après, fertilisants, ravageurs/maladies.
- **RH** : équipes, opérateurs (données RH, pas de login), compétences (niveaux), absences (workflow demande→validation).
- **Rapports** : rapport mensuel/hebdo, export PDF & Excel.
- **Paramètres** : types de tâches, ratios de productivité, horaires, jours fériés.

> Design, couleurs, sidebar, composants : **thème Emerald (§1.2.b), inchangé**.

---

## 5. Produit 2 — Green Éclairage (NOUVEAU — à concevoir)

Produit symétrique à Espaces Verts, appliqué au **patrimoine d'éclairage public** (luminaires, mâts, réseau électrique). Même logique SIG : des objets géolocalisés, un inventaire, une planification de maintenance, des signalements de panne, un suivi d'intervention — plus un module **énergie** propre à ce métier.

### 5.1 Modèle de données objets (mock)

**Points lumineux (équivalents de la « végétation ») :**

```ts
interface Luminaire {
  id: string;
  reference: string;              // "LUM-0001"
  type: 'LED' | 'SODIUM' | 'PROJECTEUR' | 'BORNE' | 'APPLIQUE' | 'GUIRLANDE';
  puissance_w: number;            // 40, 70, 100, 150...
  hauteur_feu_m?: number;
  support?: string;               // mât associé
  etat: 'ALLUME' | 'ETEINT' | 'EN_PANNE' | 'MAINTENANCE' | 'VETUSTE';
  temperature_couleur_k?: number; // 3000K, 4000K
  date_pose?: string;
  site_id: string;                // zone/secteur
  coordinates: { lat: number; lng: number };
}
```

**Réseau électrique (équivalents de « hydraulique ») :**

```ts
interface EquipementElectrique {
  id: string;
  reference: string;
  type: 'ARMOIRE' | 'LIGNE' | 'COFFRET' | 'TRANSFORMATEUR' | 'COMPTEUR' | 'CELLULE_PHOTO';
  geometryType: 'Point' | 'LineString';
  etat: 'EN_SERVICE' | 'HORS_SERVICE' | 'MAINTENANCE';
  puissance_kva?: number;         // pour transfo/armoire
  nb_departs?: number;            // pour armoire
  coordinates: { lat: number; lng: number } | Array<{ lat: number; lng: number }>;
}
```

**Zone / Secteur d'éclairage (équivalent « site ») :**

```ts
interface ZoneEclairage {
  id: string;
  nom: string;                    // "Centre-ville", "Zone industrielle Nord"
  nb_luminaires: number;
  puissance_totale_kw: number;
  calendrier_allumage?: string;   // "Crépuscule → Aube" | horaire fixe
  coordinates: { lat: number; lng: number };
}
```

### 5.2 Modules détaillés

#### 5.2.1 Dashboard éclairage
Cartes KPI : **Nb points lumineux**, **% en panne**, **Consommation du mois (kWh)**, **Puissance installée (kW)**, **Taux de LED (%)**, **Signalements ouverts**. Graphiques : évolution conso (courbe), répartition par type de luminaire (donut), pannes par secteur (barres). Liste des dernières pannes signalées.

#### 5.2.2 Cartographie
Même carte plein écran que Espaces Verts. Couches :
- **Points lumineux** (pastilles ambre/jaune selon type ; icône ampoule/`Lightbulb`).
- **Réseau électrique** (lignes bleues + points armoires/transfos).
- **Secteurs d'éclairage** (polygones).
- **Signalements de panne** (marqueurs rouges).
Légende colorée (cf. §1.4). Clic sur luminaire → panneau latéral (état, puissance, dernière maintenance).

#### 5.2.3 Inventaire des luminaires
Tableau unifié (comme `Produits.tsx`) : colonnes Référence, Type (badge coloré + icône), Puissance, État (StatusBadge), Secteur, Dernière maintenance. Filtres : Type / État / Secteur. Cartes de stats en tête (Total, Allumés, En panne, LED, Vétustes). Actions : voir / éditer / changer d'état.

#### 5.2.4 Zones / Secteurs
Liste + détail d'un secteur : nombre de luminaires, puissance totale, calendrier d'allumage, carte du secteur.

#### 5.2.5 Planification (maintenance)
Calendrier des interventions : **relamping** (remplacement d'ampoules), **rondes de contrôle**, **maintenance préventive/curative**, **remplacement de luminaire**. Priorité, récurrence, affectation de techniciens. Statuts PLANIFIÉE→EN_COURS→TERMINÉE.

#### 5.2.6 Signalements de panne (réclamations)
Équivalent des réclamations. Types : **Luminaire éteint**, **Point noir (zone non éclairée)**, **Luminaire clignotant**, **Armoire hors service**, **Câble endommagé**, **Vandalisme**. Numéro auto `PAN-AAAA-XXXX`, urgence/SLA, localisation ponctuelle sur carte, cycle de vie (Nouveau → En cours → Résolu → Clôturé).

#### 5.2.7 Suivi des interventions
Détail d'intervention électrique : matériel remplacé (ampoule LED, ballast, driver…), photos avant/après, relevé, technicien, durée, consommables.

#### 5.2.8 Énergie & Performance (SPÉCIFIQUE ÉCLAIRAGE — module phare)
- **Consommation** : kWh par mois/secteur, coût estimé (€/MAD), courbe annuelle.
- **Performance** : puissance installée, ratio LED vs sodium, économies réalisées après rénovation.
- **Bilan carbone** : estimation CO₂ évitée.
- **Détection d'anomalies** : luminaires consommant anormalement (mock).
Visualisations Recharts : courbes de conso, jauges, comparatif avant/après relamping.

#### 5.2.9 RH / Techniciens
Équipes de techniciens, compétences (habilitations électriques B1/B2/BR…), plannings, absences. Réutilise le module RH d'Espaces Verts adapté aux habilitations.

#### 5.2.10 Rapports
Rapport mensuel éclairage : conso, taux de panne, interventions réalisées, points lumineux ajoutés/rénovés. Export PDF/Excel.

#### 5.2.11 Paramètres
Types de luminaires, calendriers d'allumage (astronomique crépuscule/aube ou horaire), seuils d'alerte conso, catalogue de matériel.

### 5.3 Logique métier DIRECTE (à câbler côté frontend, pas seulement décorative)

> Le produit Éclairage doit **calculer réellement** ses indicateurs à partir des mocks (fonctions pures dans `lib/eclairage.ts`), pas afficher des nombres codés en dur. Voici les règles à implémenter directement :

**1. État allumé/éteint (calendrier astronomique simulé)**
- Heures d'allumage simulées : **allumage au crépuscule ≈ 18h30**, **extinction à l'aube ≈ 06h30** (constantes `HEURE_ALLUMAGE`, `HEURE_EXTINCTION`).
- `estAllume(now)` → vrai si l'heure courante est dans la plage nocturne. Un luminaire `EN_PANNE` reste « éteint » même la nuit ; `MAINTENANCE`/`VETUSTE` = exclus du fonctionnement normal.
- Durée d'allumage journalière ≈ **12 h** (`HEURES_ALLUMAGE_JOUR = 12`).

**2. Consommation énergétique (formule directe)**
- Par luminaire : `kWh_jour = (puissance_w / 1000) × HEURES_ALLUMAGE_JOUR`.
- Par période : `kWh_mois = kWh_jour × nb_jours`. Agréger par **secteur** et **global**.
- Coût : `cout_MAD = kWh × TARIF_KWH_MAD` (constante `TARIF_KWH_MAD ≈ 1.2`).

**3. Taux de panne & disponibilité**
- `tauxPanne = luminaires_en_panne / total`. `disponibilite = 1 - tauxPanne`.
- Un secteur avec `tauxPanne > SEUIL_ALERTE (ex. 10%)` est signalé en **rouge** sur le dashboard.

**4. Taux de LED & économies (avant/après relamping)**
- `tauxLED = nb_LED / total`.
- Économie estimée : comparer la conso réelle à une **conso de référence tout-sodium** (`puissance_sodium_equiv` ≈ 1,8 × puissance LED) → `economie_kWh = conso_sodium_ref − conso_actuelle`.

**5. Bilan carbone**
- `co2_evite_kg = economie_kWh × FACTEUR_CO2` (constante `FACTEUR_CO2 ≈ 0.7 kgCO₂/kWh`).

**6. Détection d'anomalie (mock déterministe)**
- Un luminaire « anormal » = état `ALLUME` la journée, OU conso > 1,5 × conso attendue pour sa puissance. Lister ces cas dans le module Énergie.

> Toutes ces valeurs alimentent **directement** les KPI du Dashboard (§5.2.1) et les graphiques Énergie (§5.2.8). Exposer les constantes dans un fichier `constants/eclairage.ts` pour ajustement facile.

---

## 6. Écrans clés à générer (priorités Lovable)

Ordre de priorité pour la démo :

1. **Écran de connexion démo** (SANS mot de passe, thème Indigo) — une carte **« Administrateur SIG Patrimoine »** + la **liste des organisations** (cartes cliquables avec badges produits & état de licence). Cf. §2.3.
2. **Sélecteur de produit** — 2 grandes cartes (Espaces Verts / Green Éclairage) avec accent produit, n'affiche que les produits sous licence active/essai du tenant (produit non licencié = carte verrouillée).
3. **Console Plateforme (SUPERADMIN)** :
   - Dashboard plateforme (KPIs globaux).
   - **Liste des tenants** (tableau : nom, ville, produits (badges), statut licence, nb users/sites) + bouton « Créer un tenant ». Ligne cliquable → détail.
   - **Modale de création de tenant** : nom, slug, ville, contact, **cases à cocher des produits à attribuer** (= création de licences), plan, statut initial.
   - **Détail tenant** (`/platform/tenants/:id`) : en-tête + stats, section **Produits & Licences** (carte par produit : plan, seats, expiration, statut ; bouton « Attribuer » si absent), gestion licence (suspendre/prolonger/changer plan/révoquer), et sur chaque produit un bouton **▶ « Accéder à l'espace »**.
   - **Accès admin à l'espace tenant (impersonation)** : clic sur « Accéder à l'espace » → **la sidebar bascule** vers le menu du produit (thème Emerald/Ambre), URL `/espaces-verts|eclairage/...`, **bandeau « Mode admin — espace de [tenant] » + bouton « Revenir à la console »**. Cf. §2.6.
4. **Green Éclairage — Dashboard** (module phare visuel).
5. **Green Éclairage — Cartographie** (carte + couches lumineuses/électriques + légende).
6. **Green Éclairage — Inventaire des luminaires** (tableau + stats + filtres).
7. **Green Éclairage — Énergie** (graphiques Recharts).
8. **Green Éclairage — Signalements de panne**.
9. **Espaces Verts** : au moins Dashboard + Cartographie + Inventaire pour prouver la parité.
10. **Product/Tenant switcher** persistant (en haut de sidebar : logo tenant + produit courant + menu de bascule).

---

## 7. Données simulées (mock) — jeux à fournir

Fournir dans le code des fichiers `mock/` :

- `mockTenants.ts` : **6 tenants fictifs mais réalistes** (contexte marocain, cohérent avec le campus UM6P/Benguérir). Utiliser ces noms concrets :

| Tenant | Ville | Produits (licences) | Statut | Plan / Licence |
|--------|-------|---------------------|--------|----------------|
| **Commune de Benguérir** | Benguérir | Espaces Verts + Green Éclairage | ACTIF | PRO (les 2), actives |
| **Université Mohammed VI Polytechnique (UM6P)** | Benguérir | Espaces Verts + Green Éclairage | ACTIF | ENTERPRISE (les 2) |
| **Régie des Espaces Verts de Marrakech** | Marrakech | Espaces Verts | ACTIF | PRO |
| **Société de Développement Local « Marrakech Lumière »** | Marrakech | Green Éclairage | ACTIF | PRO |
| **Green City Mohammed VI** | Benguérir | Espaces Verts + Green Éclairage | EN_ATTENTE | STARTER (essai 30 j) |
| **Régie Autonome d'Éclairage Public de Casablanca** | Casablanca | Green Éclairage | SUSPENDU | PRO — **licence EXPIRÉE** (démo verrouillage/renouvellement) |

> Ces jeux couvrent tous les cas : mono-produit, bi-produit, essai en attente, et licence expirée (produit verrouillé côté tenant).

- `mockLicences.ts` : les licences correspondantes (une par produit détenu), avec `plan`, `statut`, `seats`/`seatsUtilises`, `dateDebut`/`dateFin`, `prixMensuelMAD`, `renouvellementAuto`.
- `mockUsers.ts` : un utilisateur par rôle et par tenant. Exemples : `admin@sigpatrimoine.ma` (SUPERADMIN), `y.benali@benguerir.ma` (TENANT_ADMIN Commune de Benguérir), `superviseur@um6p.ma`, `agent@marrakech-lumiere.ma`, etc.
- **Espaces Verts** : réutiliser/mimer les données existantes (arbres, gazons, sites, tâches, réclamations).
- **Green Éclairage** :
  - `mockLuminaires.ts` : ~40 luminaires variés (types, états, puissances), géolocalisés autour de `lat 32.216, lng -7.937` (campus UM6P, Benguérir — cohérent avec l'existant).
  - `mockReseauElec.ts` : ~10 armoires/transfos + lignes.
  - `mockZones.ts` : 4–5 secteurs.
  - `mockPannes.ts` : ~15 signalements à divers statuts.
  - `mockConsoEnergie.ts` : 12 mois de conso par secteur.

> Centre carto par défaut (repris de l'existant) : `{ lat: 32.216, lng: -7.937, zoom: 15 }`.

---

## 8. Stack technique demandée à Lovable

- **React 19 + TypeScript + Vite**.
- **Tailwind CSS** (classes standard, cf. §1).
- **lucide-react** pour les icônes.
- **Recharts** pour les graphiques (dashboard, énergie).
- **Cartographie** : au choix — `react-leaflet`/OpenLayers si dispo dans Lovable, sinon un **placeholder carte** (image de fond + marqueurs positionnés en absolu) pour la démo. Le rendu doit rester crédible.
- **État global** : contextes React — `AuthContext`, `TenantContext`, `ProductContext`, `ThemeContext` (mock). Pas de state manager lourd requis.
- **Aucun backend** : toutes les données viennent des fichiers `mock/`. L'« auth » compare à des comptes mock en dur.
- **Fichiers** : composants PascalCase, exports nommés, props typées (`ComponentNameProps`), handlers `handle*`, props `on*`, constantes `UPPER_SNAKE_CASE`.

### 8.1 Architecture MULTI-PAGES (PAS de SPA)

> **Exigence forte** : l'app **ne doit PAS être une single-page application monolithique**. Chaque écran est une **page distincte** avec sa **propre URL/route**, sa propre navigation, et son propre thème de contexte. On veut une structure **multi-pages** claire — une page = un fichier = une route — et non une seule page qui remplace son contenu en interne.

- **Un fichier de page par écran** dans `pages/` (ex. `pages/platform/TenantsPage.tsx`, `pages/eclairage/DashboardPage.tsx`, `pages/espaces-verts/InventoryPage.tsx`). Pas de « méga-composant » qui gère plusieurs vues via un `useState`.
- **Routing par URL réelle** : chaque module a une route dédiée (cf. §3). Naviguer = changer de page/URL, pas basculer un onglet interne.
- **Layouts séparés par territoire** : `PlatformLayout` (thème Indigo), `EspacesVertsLayout` (thème Emerald), `EclairageLayout` (thème Ambre). Chaque layout porte SA sidebar et SON thème ; changer de produit = changer de layout + de préfixe d'URL (`/platform/...`, `/espaces-verts/...`, `/eclairage/...`).
- **Aucune logique métier globale** cachée dans un seul composant racine : App = uniquement le routeur + les providers. Le contenu vit dans les pages.
- Si Lovable propose du **routing type Next/pages** ou du **file-based routing**, le préférer pour matérialiser le multi-pages. Sinon, `react-router` avec **une `<Route>` par page** et des layouts imbriqués (jamais un rendu conditionnel géant).

---

## 9. Prompt prêt à coller dans Lovable

> Copier-coller ce bloc dans Lovable, puis compléter au besoin avec les sections détaillées ci-dessus.

```
Construis un frontend React 19 + TypeScript + Vite + Tailwind, 100% simulé (aucun backend,
données mock en mémoire), pour une plateforme SaaS MULTI-TENANT et MULTI-PRODUIT nommée
« SIG Patrimoine ».

ARCHITECTURE MULTI-PAGES (EXIGENCE FORTE — PAS DE SPA MONOLITHIQUE) :
- Chaque écran = une PAGE distincte avec sa PROPRE URL/route et son propre fichier dans
  pages/. Interdiction du méga-composant unique qui change de vue via useState.
- 3 layouts séparés, chacun avec SA sidebar et SON thème : PlatformLayout (/platform/*),
  EspacesVertsLayout (/espaces-verts/*), EclairageLayout (/eclairage/*). Changer de produit
  = changer de layout + de préfixe d'URL, pas un onglet interne.
- App.tsx = uniquement routeur + providers. Le contenu vit dans les pages.

TROIS IDENTITÉS COULEUR DISTINCTES (le chrome bascule selon le contexte via ThemeContext) :
1) SIG Patrimoine / PLATEFORME = INDIGO & ARDOISE (NOUVELLE marque) :
   sidebar slate-900 #0f172a, surfaces slate-800, boutons indigo-600 #4f46e5
   hover indigo-700, actif indigo-500, accent indigo-400 #818cf8 / violet-400.
   Dégradé login/console : from-indigo-900 via-slate-900 to-slate-950.
2) ESPACES VERTS (produit 1, EXISTANT inchangé) = EMERALD :
   sidebar emerald-950 #022c22, boutons emerald-700 #047857, actif emerald-600,
   accent emerald-400 #4ade80, secondaire lime-400.
3) GREEN ÉCLAIRAGE (produit 2, NOUVELLE marque) = AMBRE & NUIT :
   sidebar stone-900 #1c1917, surfaces stone-800, boutons amber-500 #f59e0b
   hover amber-600, actif amber-500, accent amber-400 #fbbf24, secondaire sky-500 #0ea5e9
   (réseau électrique). Dégradé : from-amber-900 via-stone-900 to-stone-950.
Tokens communs (forme, la couleur suit le thème) : police système (system-ui), icônes
lucide-react, UI en français, rayons rounded-lg/2xl, ombres shadow-sm/2xl, sidebar
260px/72px repliée avec item actif en ring + puce, boutons active:scale-98, champs
border-slate-200 bg-slate-50 rounded-lg focus:ring-2 (couleur d'accent du thème courant).

MULTI-TENANT + LICENCES (simulé) :
- 5 rôles : SUPERADMIN (plateforme), TENANT_ADMIN, SUPERVISEUR, AGENT, CLIENT.
- SEUL le SUPERADMIN (thème Indigo), depuis SA console, crée les tenants ET leur attribue les
  produits. ATTRIBUER UN PRODUIT = CRÉER UNE LICENCE (plan Starter/Pro/Enterprise, seats,
  date début/fin, renouvellement auto). Un tenant ne voit/n'utilise QUE les produits sous
  licence ACTIVE ou ESSAI. Licence EXPIREE/SUSPENDUE => produit verrouillé (cadenas + CTA
  Renouveler). Le SUPERADMIN peut suspendre/prolonger/changer de plan/révoquer.
- Page /platform/billing (mock) : grille des 3 plans + écran de paiement factice (formulaire
  carte mock, pas de vraie transaction) qui active la licence. Prépare un futur achat en
  libre-service (Stripe/CMI plus tard). Pages aussi : /platform/tenants, /platform/tenants/:id
  (section Produits & Licences avec bouton Attribuer), /platform/licences, /platform/dashboard.
- ACCÈS ADMIN À L'ESPACE TENANT (impersonation) : la liste des tenants est cliquable → page
  détail (/platform/tenants/:id) affichant en-tête + stats + cartes Produits & Licences. Chaque
  produit a un bouton « Accéder à l'espace ». Clic => L'ADMIN ENTRE DANS L'ESPACE DU TENANT et
  LE MENU CHANGE : la sidebar Plateforme (Indigo) est remplacée par la sidebar du produit
  (Emerald pour Espaces Verts, Ambre pour Éclairage), URL /espaces-verts|eclairage/..., avec un
  BANDEAU permanent « Mode admin — espace de [tenant] » + bouton « Revenir à la console » (qui
  remonte PlatformLayout/Indigo). État d'impersonation dans un contexte (impersonatedTenantId +
  activeProduct).
- Après entrée dans un tenant, sélecteur de PRODUIT (2 grandes cartes aux couleurs de chaque
  produit ; produit non licencié = carte verrouillée), puis layout métier. Switcher
  produit/tenant en haut de sidebar.

CONNEXION = ACCÈS DÉMO SANS MOT DE PASSE (frontend réel sans backend) :
- La page de login n'a AUCUN formulaire email/mot de passe. Elle affiche UNIQUEMENT :
  (1) une carte « Administrateur SIG Patrimoine » → clic = entre dans la Console Plateforme
  (SUPERADMIN, thème Indigo) ;
  (2) la LISTE DES ORGANISATIONS (tenants du mock) sous forme de cartes cliquables (logo/
  initiales, nom, ville, badges produits EV/Éclairage, état de licence ✅ Actif / ⏳ Essai /
  🔒 Expirée) → clic = entre dans ce tenant en tant que TENANT_ADMIN, puis sélecteur de produit.
- Une organisation à licence expirée est cliquable mais mène à l'écran produit verrouillé.
- Les tenants créés par l'admin dans la console apparaissent aussi dans cette liste (état
  partagé via contexte / localStorage) : créer un tenant → il devient sélectionnable au login.

DEUX PRODUITS :
1) « Espaces Verts » (thème Emerald) : pages Dashboard, Cartographie (couches
   végétation/hydraulique/sites + légende), Inventaire, Sites, Planification, Réclamations,
   Suivi des tâches, RH, Rapports, Paramètres. Données mock (arbres, gazons...).
2) « Green Éclairage » (thème Ambre&Nuit) : pages Dashboard éclairage, Cartographie
   (luminaires en ambre + réseau élec en bleu sky + secteurs + pannes en rouge),
   Inventaire des luminaires, Zones/Secteurs, Planification (relamping/maintenance),
   Signalements de panne, Suivi d'interventions, ÉNERGIE & Performance (graphiques Recharts :
   conso kWh, taux LED, bilan carbone), RH techniciens (habilitations électriques),
   Rapports, Paramètres.

LOGIQUE ÉCLAIRAGE DIRECTE (fonctions pures dans lib/eclairage.ts, PAS de chiffres codés en
dur) : état allumé/éteint via calendrier astronomique simulé (allumage ~18h30, extinction
~06h30, ~12h/j) ; conso kWh = (puissance_w/1000)×heures×jours, coût = kWh×1.2 MAD ;
tauxPanne = en_panne/total ; tauxLED = LED/total ; économie vs référence tout-sodium
(≈1.8× puissance) ; CO2 évité = économie_kWh×0.7. Ces calculs alimentent les KPI et graphiques.

OBJETS ÉCLAIRAGE (mock) : Luminaire {type: LED|SODIUM|PROJECTEUR|BORNE|APPLIQUE|GUIRLANDE,
puissance_w, etat: ALLUME|ETEINT|EN_PANNE|MAINTENANCE|VETUSTE}, EquipementElectrique
{ARMOIRE|LIGNE|COFFRET|TRANSFORMATEUR|COMPTEUR|CELLULE_PHOTO}, ZoneEclairage.
Géolocaliser autour de lat 32.216, lng -7.937 (zoom 15). ~40 luminaires, ~15 pannes,
12 mois de conso, 4 secteurs.

TENANTS FICTIFS RÉALISTES (mock, contexte marocain) : « Commune de Benguérir » (EV+Éclairage,
Pro, actif), « Université Mohammed VI Polytechnique (UM6P) » (EV+Éclairage, Enterprise),
« Régie des Espaces Verts de Marrakech » (EV, Pro), « SDL Marrakech Lumière » (Éclairage, Pro),
« Green City Mohammed VI » (EV+Éclairage, Starter/essai, en attente), « Régie Autonome
d'Éclairage Public de Casablanca » (Éclairage, licence EXPIRÉE → produit verrouillé).

PAGES PRIORITAIRES : Écran de connexion démo (carte Admin + liste des organisations, sans mot
de passe) → [Admin] Console Plateforme (tenants + attribution licence + billing) OU [Org]
Sélecteur de produit → Green Éclairage (Dashboard, Carte, Inventaire, Énergie, Pannes) →
Espaces Verts (Dashboard, Carte, Inventaire). Carte : react-leaflet si dispo, sinon
placeholder crédible (fond + marqueurs en position absolue).

Contextes React mock : Auth/Tenant/Product/Theme. DataTable générique triable/paginé,
StatCard, StatusBadge, spinner (couleur du thème). Aucune persistance requise
(localStorage optionnel).
```

---

## 10. Checklist de conformité (avant de considérer la démo terminée)

- [ ] **3 thèmes distincts** : plateforme = Indigo/Ardoise, Espaces Verts = Emerald (inchangé), Éclairage = Ambre/Nuit.
- [ ] Le chrome (sidebar, boutons, spinner, focus) **bascule** bien de couleur selon le contexte.
- [ ] **Architecture multi-pages** : une URL + un fichier par écran, 3 layouts séparés, pas de méga-composant SPA.
- [ ] La marque Emerald d'Espaces Verts est identique à l'existant.
- [ ] Le SUPERADMIN peut créer un tenant et lui attribuer 1 ou 2 produits.
- [ ] Un tenant ne voit que les produits qui lui sont attribués.
- [ ] Le sélecteur de produit bascule bien de layout, de thème et d'URL.
- [ ] Green Éclairage a ses 11 modules, dont le module Énergie avec graphiques.
- [ ] La cartographie éclairage affiche luminaires (ambre) + réseau (bleu sky) + légende.
- [ ] L'inventaire luminaires reprend le pattern du tableau unifié existant.
- [ ] Espaces Verts prouve la parité (au moins Dashboard + Carte + Inventaire).
- [ ] Tout fonctionne en mock, sans aucun appel réseau.
- [ ] UI 100% en français, responsive, sidebar repliable.

---

*Document de spécification — SIG Patrimoine (Espaces Verts + Green Éclairage). Rédigé pour génération Lovable, frontend simulé sans backend.*

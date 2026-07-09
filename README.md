# SIG Patrimoine — Frontend

Plateforme SaaS **multi-tenant** et **multi-produit** de gestion de patrimoine territorial.
Ce dépôt est le **frontend de démonstration** (aucun backend réel — données simulées / mock),
générable et démonstrable de bout en bout.

La plateforme **SIG Patrimoine** est la marque parapluie qui regroupe **deux produits** :

| Produit | Rôle | Thème | Intégration |
| --- | --- | --- | --- |
| 🟢 **Espaces Verts** | SIG de gestion du patrimoine végétal (arbres, gazon, réseaux…) | Emerald | Application existante (`greensig-front`) **embarquée nativement** |
| 🟡 **Green Éclairage** | SIG de gestion de l'éclairage public (luminaires, réseau électrique) | Ambre & Nuit | Développé **nativement** dans la console |

---

## Sommaire

- [Concept](#concept)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts](#scripts)
- [Les deux produits](#les-deux-produits)
- [Multi-tenant, licences & produits paramétrables](#multi-tenant-licences--produits-paramétrables)
- [Cartographie](#cartographie)
- [Démo sans backend](#démo-sans-backend)
- [Déploiement](#déploiement)
- [Stack technique](#stack-technique)

---

## Concept

Trois niveaux d'expérience :

1. **Plateforme** — le **Super-Admin SIG Patrimoine** crée des **organisations (tenants)**,
   leur **attribue des produits** (= création de **licences**), gère la facturation et le
   catalogue de produits.
2. **Tenant** — une organisation (commune, régie, université…) accède à son espace et choisit
   son **produit** (Espaces Verts et/ou Green Éclairage).
3. **Métier** — les modules opérationnels du produit choisi (cartographie, inventaire,
   planification, signalements, rapports…).

> **Authentification de démo** : la page d'accueil ne demande **aucun mot de passe**. On
> choisit soit **l'Administrateur SIG Patrimoine**, soit **une organisation** dans la liste.

---

## Architecture

- **Console** (`src/`) — application **TanStack Start** (React 19, SSR via Nitro), routing par
  fichiers, Tailwind CSS v4. Contient la plateforme (Super-Admin) et le produit **Green Éclairage**.
- **Espaces Verts** (`apps/espaces-verts/`) — l'application **greensig-front** complète
  (React 19 + React Router + OpenLayers), intégrée **nativement** (même build, pas d'iframe).
  Montée en client-only sous le préfixe `/espaces-verts` via `EspacesVertsHost`.

Points clés d'intégration :

- Alias **`@ev/*`** dédié à `apps/espaces-verts` (pour ne pas entrer en conflit avec `@/*` = `src/`).
- Montée **client-only** de l'app Espaces Verts (elle crée son propre routeur et touche
  `window`) → aucun crash SSR.
- Basename `/espaces-verts` via `VITE_EV_BASENAME` (voir `.env`).

---

## Structure du projet

```
SIG-Patrimoine-Front/
├─ src/                              # Console (TanStack Start)
│  ├─ routes/
│  │  ├─ index.tsx                   # Écran de connexion démo (Admin + organisations)
│  │  ├─ select-product.tsx          # Sélecteur de produit
│  │  ├─ platform.*.tsx              # Console plateforme (tenants, produits, licences, billing…)
│  │  ├─ eclairage.*.tsx             # 🟡 Green Éclairage (dashboard, map, inventory, planning…)
│  │  └─ espaces-verts.*.tsx         # 🟢 Monte l'app Espaces Verts embarquée
│  ├─ components/
│  │  ├─ layouts/                    # PlatformLayout, EclairageLayout, EspacesVertsLayout
│  │  ├─ shared/                     # Sidebar, TopBar, DataTable, ModuleHeader, TileMap…
│  │  └─ eclairage/                  # EclairageMap (carte persistante), EclairageTopBar…
│  ├─ contexts/AppContext.tsx        # État global (auth démo, tenants, licences, produits)
│  ├─ lib/                           # types, theme, mockData, mockEclairage, eclairage (logique)
│  └─ styles.css                     # Tailwind v4 + design system
├─ apps/
│  └─ espaces-verts/                 # 🟢 greensig-front complet (module interne, alias @ev/)
├─ vercel.json                       # Déploiement Vercel (preset Nitro vercel)
├─ DEPLOY_VERCEL.md                  # Guide de déploiement
└─ .env                              # VITE_EV_BASENAME=/espaces-verts
```

---

## Démarrage rapide

Prérequis : **Bun** (recommandé) ou Node 20+.

```bash
bun install        # ou npm install
bun run dev        # démarre la console sur http://localhost:8080
```

> Un **seul serveur** suffit : Espaces Verts et Green Éclairage sont dans le même build.

Ouvrir **http://localhost:8080** → choisir l'Administrateur ou une organisation.

> Après modification des dépendances, vider le cache Vite si besoin :
> `rm -rf node_modules/.vite && bun run dev`.

---

## Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Serveur de développement (port 8080) |
| `bun run build` | Build de production (Nitro) |
| `bun run preview` | Prévisualise le build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |

---

## Les deux produits

### 🟢 Espaces Verts (embarqué)

L'application `greensig-front` complète (cartographie OpenLayers, inventaire, planification,
réclamations, RH, rapports…), montée nativement. En mode démo, ses appels `/api` sont
désactivés (réponses vides) — le branchement de données mock est une étape ultérieure.

### 🟡 Green Éclairage (natif, map-centric)

Structure inspirée d'Espaces Verts :

- **Carte persistante** en fond (`EclairageMap`) ; les modules s'ouvrent dans un **panneau
  flottant** par-dessus, refermable via un **X** qui revient à la carte.
- **Barre du haut** dans le panneau (recherche centrée, horloge live, utilisateur).
- Modules : **Dashboard**, **Cartographie**, **Inventaire luminaires**, **Zones/Secteurs**,
  **Planification** (calendrier + liste), **Signalements**, **Interventions**, **Techniciens**,
  **Rapports** (KPIs énergie + graphiques), **Paramètres**.
- Composants partagés (`ModuleHeader`, `FilterBar`, `DataTable`, `DetailModal`) → structure de
  page **identique** sur tous les modules.

---

## Multi-tenant, licences & produits paramétrables

- **Tenants** créés par le Super-Admin ; chaque tenant ne voit que les produits sous **licence
  active/essai**. Une licence expirée verrouille le produit.
- **Attribuer un produit = créer une licence** (plan Starter/Pro/Enterprise, seats, dates).
- **Impersonation** : le Super-Admin peut « accéder à l'espace » d'un tenant (bandeau + retour
  console).
- **Produits 100 % paramétrables** (`/platform/products`) : nom, description, icône, couleurs,
  statut, et **modules activables** — CRUD complet.
- L'état (tenants, licences, produits) est persisté en **`localStorage`** (démo).

---

## Cartographie

Composant `TileMap` (sans dépendance de carte lourde) :

- Fonds : **Satellite** (Esri, défaut), **Plan** (OpenStreetMap), **Relief** (OpenTopoMap).
- Interactions : déplacement (pan), zoom molette/boutons, recentrer, **calques** activables,
  clic sur un objet → **panneau de détails**, **placement au clic** (ajouter un luminaire).
- **Symbologie par icônes** (ampoule, éclair, alerte) + **lignes** (câbles le long des voies).
- Les objets sont posés sur de **vraies routes** (géométrie OpenStreetMap de Benguérir/UM6P).

---

## Démo sans backend

Toutes les données proviennent de fichiers **mock** (`src/lib/mockData.ts`,
`src/lib/mockEclairage.ts`). Aucun appel réseau n'est requis (hors tuiles de carte, chargées
côté navigateur). Idéal pour une démonstration ou une génération d'UI.

---

## Déploiement

Déploiement **Vercel** préconfiguré (`vercel.json`) — Nitro produit la sortie **Build Output
API** (`.vercel/output`) via le preset `vercel`.

Voir **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** pour le détail. En résumé : importer le dépôt
sur Vercel, laisser `vercel.json` piloter le build, déployer.

---

## Stack technique

- **React 19** + **TypeScript**
- **TanStack Start** / **TanStack Router** (routing par fichiers, SSR via **Nitro**)
- **Vite 8** + **Bun**
- **Tailwind CSS v4**
- **Recharts** (graphiques), **react-big-calendar** (planning), **lucide-react** (icônes)
- **date-fns** (dates/horloge)
- Espaces Verts embarqué : **React Router**, **OpenLayers**, jsPDF/exceljs, etc.

---

*Frontend de démonstration — SIG Patrimoine (Espaces Verts + Green Éclairage). Données simulées,
sans backend.*

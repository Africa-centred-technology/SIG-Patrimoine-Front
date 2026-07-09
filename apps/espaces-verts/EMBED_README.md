# Espaces Verts — module natif de SIG Patrimoine

Ce dossier contient l'application **greensig-front** (le produit « Espaces Verts »), intégrée
**nativement** dans la plateforme **SIG Patrimoine** — **pas** en iframe, **pas** en app externe.
C'est un module du **même build** que la console (et que Green Éclairage).

## Comment c'est branché

- Le code vit ici, sous `apps/espaces-verts/`, avec l'alias d'import **`@ev/*`** (au lieu de
  `@/*` qui, dans la console, désigne `src/`). Voir `vite.config.ts` et `tsconfig.json`.
- Les routes `src/routes/espaces-verts.index.tsx` et `src/routes/espaces-verts.$.tsx` montent
  l'app via `src/components/EspacesVertsHost.tsx`.
- `EspacesVertsHost` importe **dynamiquement** `apps/espaces-verts/App` **côté client uniquement**
  (l'app est client-only : `createBrowserRouter`, `window`, `localStorage`), ce qui évite tout
  crash SSR de la console TanStack Start.
- L'app tourne sous **basename `/espaces-verts`** (`VITE_EV_BASENAME`, voir `.env`). Son routeur
  react-router gère en interne toutes ses sous-pages (`/espaces-verts/dashboard`, `/map`, …),
  captées par la route splat `espaces-verts.$`.
- L'app apporte son propre layout, sa sidebar et son thème emerald. Un bouton flottant
  « Console » (`EspacesVertsLayout`) permet de revenir à la plateforme (fin d'impersonation).

## Lancer / builder (un seul projet, un seul build)

```bash
# À la racine SIG-Patrimoine-Front (PAS besoin d'un 2e serveur)
bun install
bun run dev       # console + Espaces Verts + Green Éclairage
bun run build     # build unique de production
```

## À vérifier au runtime

- **Styles Tailwind** : greensig utilisait Tailwind v3 (CDN) ; la console est en v4. Vérifier
  que les classes de greensig sont bien générées (sinon ajuster le scan des sources Tailwind).
- **Backend** : l'app appelle `/api` (JWT). Sans backend, elle montre son écran de login /
  états de chargement. Brancher des données mock (démo sans backend) = étape suivante.

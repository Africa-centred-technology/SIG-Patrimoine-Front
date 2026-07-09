# Espaces Verts — application embarquée

Ce dossier contient l'application **greensig-front complète** (le produit « Espaces Verts »),
intégrée telle quelle dans la plateforme **SIG Patrimoine** (stratégie *embed*).

La console SIG Patrimoine (racine `SIG-Patrimoine-Front/`, TanStack Start) l'affiche en
**iframe plein cadre** depuis le produit « Espaces Verts » — voir
`src/components/layouts/EspacesVertsLayout.tsx`. L'app apporte sa propre sidebar, son layout
et son thème emerald.

## Lancer la démo en local (2 serveurs)

```bash
# 1) L'application Espaces Verts (ce dossier) — port 3000
cd apps/espaces-verts
npm install
npm run dev            # http://localhost:3000

# 2) La console SIG Patrimoine (racine du repo) — dans un autre terminal
cd ../..
bun install            # ou npm install
bun run dev            # ouvre la console ; le produit Espaces Verts charge l'iframe :3000
```

La console lit l'URL de l'app via `VITE_EV_APP_URL` (défaut `http://localhost:3000`).
Copier `.env.example` → `.env` à la racine pour la surcharger.

## Contexte transmis à l'iframe

La console passe en query string : `?embedded=1&theme=emerald&tenant=<id>&tenantNom=<nom>`.
Ces paramètres sont disponibles pour un usage futur côté greensig-front (masquer son propre
login en mode embarqué, filtrer par tenant, etc.).

## Prod (déploiement unique, optionnel)

Builder cette app avec une `base` dédiée (ex. `/ev-app/`), copier son `dist/` dans le
`public/` de la console, puis pointer `VITE_EV_APP_URL=/ev-app/`.

> Note : cette app appelle un backend `/api` (JWT). Sans backend, elle affiche son écran de
> login / états de chargement. Le branchement de données mock (démo sans backend) est une
> étape ultérieure.

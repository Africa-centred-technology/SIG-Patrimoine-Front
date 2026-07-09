# Déploiement Vercel — SIG Patrimoine

Ce projet est une application **TanStack Start** (SSR via Nitro). Par défaut, Nitro build
pour Cloudflare ; pour Vercel, on force le preset **`vercel`**, qui produit la sortie
**Build Output API** (`.vercel/output`) que Vercel déploie automatiquement.

## Configuration (déjà en place)

`vercel.json` :

```json
{
  "framework": null,
  "installCommand": "bun install",
  "buildCommand": "NITRO_PRESET=vercel bun run build"
}
```

- Le repo utilise **bun** (`bun.lock`) → install/build via bun.
- `NITRO_PRESET=vercel` fait écrire la sortie dans `.vercel/output` (détectée par Vercel).
- `framework: null` : on laisse la Build Output API piloter le déploiement.

## Importer le projet sur Vercel

1. Vercel → **Add New → Project** → importer le dépôt
   `Africa-centred-technology/SIG-Patrimoine-Front`.
2. **Root Directory** : la racine du repo (là où se trouve `vercel.json`).
3. Build/Install/Framework sont lus depuis `vercel.json` — ne rien changer.
4. **Variables d'environnement** : aucune obligatoire. `VITE_EV_BASENAME` est déjà
   fournie via le fichier `.env` versionné (montage natif d'Espaces Verts sous
   `/espaces-verts`). L'ajouter dans Vercel seulement si vous voulez la surcharger.
5. **Deploy**.

## Notes

- Démo **sans backend** : toutes les données sont mock. Les tuiles de carte et l'éventuel
  chargement de l'app Espaces Verts sont côté client.
- Node : Vercel utilise Node 20/22 par défaut (compatible Vite 8 / TanStack Start).
- Build local équivalent : `NITRO_PRESET=vercel bun run build` → `.vercel/output`.

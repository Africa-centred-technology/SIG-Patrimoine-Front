import { createFileRoute } from "@tanstack/react-router";

// Le produit Espaces Verts affiche l'application greensig-front embarquée
// directement via EspacesVertsLayout (route parente). Rien à rendre ici.
export const Route = createFileRoute("/espaces-verts/")({
  component: () => null,
});

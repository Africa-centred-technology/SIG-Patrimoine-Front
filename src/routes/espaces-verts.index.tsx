import { createFileRoute } from "@tanstack/react-router";
import { EspacesVertsHost } from "@/components/EspacesVertsHost";

// /espaces-verts → monte l'application greensig-front (basename /espaces-verts,
// sa route "/" correspond ici).
export const Route = createFileRoute("/espaces-verts/")({
  component: EspacesVertsHost,
});

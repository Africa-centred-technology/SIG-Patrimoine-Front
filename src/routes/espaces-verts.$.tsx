import { createFileRoute } from "@tanstack/react-router";
import { EspacesVertsHost } from "@/components/EspacesVertsHost";

// /espaces-verts/* → toutes les sous-routes internes de greensig-front
// (dashboard, map, inventory, planning, reclamations, …) sont servies par le
// même hôte ; le routeur react-router interne affiche la bonne page selon l'URL.
export const Route = createFileRoute("/espaces-verts/$")({
  component: EspacesVertsHost,
});

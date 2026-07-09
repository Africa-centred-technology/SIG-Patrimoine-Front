import { createFileRoute, redirect } from "@tanstack/react-router";

// La carte est la page d'accueil du produit (les modules se ferment vers elle).
export const Route = createFileRoute("/eclairage/")({
  beforeLoad: () => {
    throw redirect({ to: "/eclairage/map" });
  },
});

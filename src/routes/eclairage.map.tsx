import { createFileRoute } from "@tanstack/react-router";

// La carte est rendue en fond permanent par EclairageLayout (map-centric).
// Cette route existe pour l'URL et le paramètre `focus` (lu par EclairageMap).
export const Route = createFileRoute("/eclairage/map")({
  component: () => null,
  validateSearch: (s: Record<string, unknown>): { focus?: string } => ({
    focus: typeof s.focus === "string" ? s.focus : undefined,
  }),
});

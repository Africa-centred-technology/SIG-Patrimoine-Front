import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/espaces-verts/")({
  beforeLoad: () => { throw redirect({ to: "/espaces-verts/dashboard" }); },
});

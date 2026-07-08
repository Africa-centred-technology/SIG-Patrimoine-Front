import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/eclairage/")({
  beforeLoad: () => { throw redirect({ to: "/eclairage/dashboard" }); },
});

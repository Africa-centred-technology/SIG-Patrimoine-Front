import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/platform/tenants")({ component: () => <Outlet /> });

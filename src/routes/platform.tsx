import { createFileRoute } from "@tanstack/react-router";
import { PlatformLayout } from "@/components/layouts/PlatformLayout";

export const Route = createFileRoute("/platform")({
  component: PlatformLayout,
});

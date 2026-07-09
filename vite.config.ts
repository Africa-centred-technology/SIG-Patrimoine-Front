// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // Alias dédié à l'application Espaces Verts (greensig-front) embarquée
        // nativement, pour ne pas entrer en conflit avec "@" (= src/) de la console.
        "@ev": fileURLToPath(new URL("./apps/espaces-verts", import.meta.url)),
      },
    },
    optimizeDeps: {
      // Prébundle des deps CommonJS de l'app Espaces Verts pour un interop correct
      // (ex. react-big-calendar/addons dragAndDrop, sinon le default n'est pas résolu).
      include: [
        "react-big-calendar",
        "react-big-calendar/lib/addons/dragAndDrop",
      ],
    },
  },
});

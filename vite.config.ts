import fs from "fs";
import os from "os";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const lucideUtilsPath = path.resolve(__dirname, "./src/lib/lucide-shared-utils.js");
const lucideUtilsFilter =
  /lucide-react[/\\]dist[/\\]esm[/\\]shared[/\\]src[/\\]utils\.js$/;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  cacheDir: path.join(os.tmpdir(), "ifk-pitch-vite-cache"),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: lucideUtilsFilter, replacement: lucideUtilsPath },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "lucide-utils-fallback",
          setup(build) {
            build.onLoad({ filter: lucideUtilsFilter }, () => ({
              contents: fs.readFileSync(lucideUtilsPath, "utf8"),
              loader: "js",
            }));
          },
        },
      ],
    },
  },
}));

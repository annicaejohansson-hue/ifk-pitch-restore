import fs from "fs";
import os from "os";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { erbjudandenApiPlugin } from "./vite-plugin-erbjudanden-api";

const lucideUtilsPath = path.resolve(__dirname, "./src/lib/lucide-shared-utils.js");
const lucideUtilsFilter =
  /lucide-react[/\\]dist[/\\]esm[/\\]shared[/\\]src[/\\]utils\.js$/;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    cacheDir: path.join(os.tmpdir(), "ifk-pitch-vite-cache"),
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
      allowedHosts: true,
    },
    plugins: [
      erbjudandenApiPlugin(),
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
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
  };
});

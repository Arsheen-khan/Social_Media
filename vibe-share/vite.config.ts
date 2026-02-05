import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:3000';

  return {
    server: {
      host: "::",
      port: 3000,
      proxy: {
        '/auth': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        '/posts': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        '/chat': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: apiBase,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api/* → gothailand-api.onrender.com/api/* เพื่อ bypass CORS ใน dev
      "/api": {
        target: "https://gothailand-api.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

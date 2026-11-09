import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: process.env.BASE_PATH || "/michigan-explorer-academy/",
  plugins: [react()],
  test: { include: ["src/**/*.test.ts"] },
});

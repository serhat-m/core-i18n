import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    restoreMocks: true,
    clearMocks: true,
    typecheck: {
      enabled: true,
      checker: "tsc",
      tsconfig: "./tsconfig.json",
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

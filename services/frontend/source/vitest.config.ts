import { loadEnv } from "vite";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    environment: "jsdom",
    env: loadEnv(mode, process.cwd(), ""),
    api: {
      host: "0.0.0.0",
      strictPort: true,
    },
    coverage: {
      reportsDirectory: "./test/coverage",
      exclude: [
        ...coverageConfigDefaults.exclude,
        // open api generated files
        "**/generated/*",
      ],
    },
  },
}));

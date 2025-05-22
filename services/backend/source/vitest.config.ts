import { coverageConfigDefaults, defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    api: {
      host: "0.0.0.0",
      strictPort: true,
    },
    coverage: {
      reportsDirectory: "./test/coverage",
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.module.ts",
        "**/orm/migrations/*",
        "**/orm/seeder/*",

        // remove when e2e tests are added
        "src/index.ts",
      ],
    },
  },
}));

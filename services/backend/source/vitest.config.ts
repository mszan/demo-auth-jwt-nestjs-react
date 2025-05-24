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

        // dtos should be unit tested only if they contain some additional logic, ignoring them for now since it's a quick demo
        // in a real world scenario, we would need to organize testable and non-testable dtos in some readable way
        "**/dto/*",

        // remove when e2e tests are added
        "src/index.ts",
      ],
    },
  },
}));

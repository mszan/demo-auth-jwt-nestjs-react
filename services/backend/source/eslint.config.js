import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  { ignores: ["node_modules", "dist", "temp"] },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  {
    plugins: { "@typescript-eslint": typescriptEslintEslintPlugin, prettier },
    languageOptions: { globals: { ...globals.node }, parser: tsParser },
    rules: {
      "@typescript-eslint/no-inferrable-types": "off",
      semi: "warn",
      quotes: ["warn", "double", { allowTemplateLiterals: true }],
      "prettier/prettier": "warn",
    },
  },
  {
    files: ["./src/**/migrations/*.ts"],
    rules: { quotes: "off", "prettier/prettier": "off" },
  },
];

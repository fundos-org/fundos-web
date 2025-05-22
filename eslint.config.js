import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier"; // Add Prettier plugin
import eslintConfigPrettier from "eslint-config-prettier"; // Add Prettier config to disable conflicting rules

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: eslintPluginPrettier, // Add Prettier as a plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...eslintConfigPrettier.rules, // Disable ESLint rules that conflict with Prettier
      "prettier/prettier": "error", // Treat Prettier formatting issues as ESLint errors
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
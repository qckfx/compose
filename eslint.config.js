import globals from "globals";

const browserGlobalsReadonly = Object.fromEntries(
  Object.keys(globals.browser).map((k) => [k, "readonly"]),
);

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.lock",
      "yarn.lock",
      "package-lock.json",
      ".turbo/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...browserGlobalsReadonly,
        NodeJS: "readonly",
      },
    },
    plugins: {
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    rules: {
      ...(await import("@eslint/js")).default.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parser: (await import("@typescript-eslint/parser")).default,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...browserGlobalsReadonly,
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin"))
        .default,
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    rules: {
      ...(await import("@eslint/js")).default.configs.recommended.rules,
      ...(await import("@typescript-eslint/eslint-plugin")).default.configs
        .recommended.rules,
      "prettier/prettier": "error",
      "no-undef": "off", // TypeScript handles this better than ESLint
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

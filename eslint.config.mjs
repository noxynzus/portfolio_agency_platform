import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from "eslint-config-next/core-web-vitals.js";

// const eslintConfig = defineConfig([
//   ...nextVitals,
//   {
//     rules: {
//       'react/no-unescaped-entities': 'off',
//       '@next/next/no-page-custom-font': 'off',
//     },
//   },
//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     '.next/**',
//     'out/**',
//     'build/**',
//     'next-env.d.ts',
//   ]),
// ])

// export default eslintConfig



import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...compat.extends("next/core-web-vitals"),
];
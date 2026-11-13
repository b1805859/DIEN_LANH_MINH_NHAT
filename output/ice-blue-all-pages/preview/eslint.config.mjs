import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Next 15 exports legacy ESLint configs; adapt them to ESLint 9 flat config.
const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['.next/**', '.next-ui*/**', 'node_modules/**', 'next-env.d.ts'] },
];

export default config;

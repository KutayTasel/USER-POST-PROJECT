declare module 'eslint-config-prettier' {
  import type { Linter } from 'eslint';
  const config: Linter.FlatConfig | Linter.FlatConfig[];
  export default config;
}

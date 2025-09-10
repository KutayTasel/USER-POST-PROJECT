import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.vite/**', 'coverage/**', '*.min.js'],
  },

  { settings: { react: { version: 'detect' } } },

  js.configs.recommended,
  pluginReact.configs.flat?.recommended ?? {},
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  eslintConfigPrettier,

  {
    files: ['src/**/*.{ts,tsx}', 'vite-env.d.ts', 'global-types/**/*.d.ts'],
    ...tseslint.configs.recommended[0],
    ...tseslint.configs.recommendedTypeChecked[0],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, React: 'readonly' },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        allowDefaultProject: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: 'TSTypeAssertion', message: 'Type assertion (<T>expr) yasak.' },
        { selector: 'TSAsExpression', message: '`as` ile type assertion yasak.' },
        {
          selector: 'TSAsExpression[typeAnnotation.type="TSAnyKeyword"]',
          message: '`as any` kesinlikle yasak.',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 10,
        },
      ],

      'no-void': ['error', { allowAsStatement: true }],

      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { attributes: true, returns: true },
          checksConditionals: true,
          checksSpreads: true,
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // Stil/kalite - Daha esnek ama kaliteli
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        { allowArgumentsExplicitlyTypedAsAny: false },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignoreConditionalTests: true, ignoreMixedLogicalExpressions: true },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/prefer-includes': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },

  // ---- Test dosyaları için özel kurallar ----
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // ---- TS uzantılı config dosyaları: TS parser, type-service KAPALI ----
  {
    files: ['vite.config.ts', 'eslint.config.ts', '**/*.config.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: { projectService: false, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // ---- JS/CJS/MJS script & config (espree) ----
  {
    files: [
      'tailwind.config.js',
      'postcss.config.cjs',
      'vite.config.{js,mts,mjs,cjs,cts}',
      'eslint.config.{js,mts,mjs,cjs,cts}',
      '**/*.config.{js,mts,mjs,cjs,cts}',
      '**/scripts/**/*.{js,mts,mjs,cjs,cts}',
      '**/*.{js,cjs,mjs}',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',

      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // CJS için
    },
  },
]);

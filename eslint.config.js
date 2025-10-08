import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['dist', 'amplify'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'perfectionist': perfectionist,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
      }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      '@typescript-eslint/no-explicit-any': "warn",
      'react-refresh/only-export-components': [
        'off',
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-empty-object-type": [
        'warn',
        {
            'allowInterfaces': 'with-single-extends'
        }
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
        },
      ],
    },
  },
)

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...fixupConfigRules(
    compat.extends('react-app', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended')
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'react-hooks': fixupPluginRules(reactHooks),
      prettier
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        process: true
      },

      parser: tsParser
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ],

      '@typescript-eslint/no-empty-function': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-useless-escape': ['off'],
      radix: ['off'],
      'array-callback-return': ['off'],
      'no-return-assign': ['off'],
      'capitalized-comments': ['off'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      camelcase: ['off'],
      'new-cap': ['off'],
      'func-names': ['off'],
      'no-prototype-builtins': ['off'],

      'no-console': [
        'warn',
        {
          allow: ['error']
        }
      ],

      eqeqeq: ['error'],

      'no-duplicate-imports': [
        'error',
        {
          includeExports: true
        }
      ],

      'react/prop-types': ['off'],
      'react/jsx-key': ['off'],
      'react/jsx-curly-brace-presence': ['error'],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return'
        },
        {
          blankLine: 'always',
          prev: ['const', 'let'],
          next: ['block-like']
        },
        {
          blankLine: 'always',
          prev: 'import',
          next: '*'
        },
        {
          blankLine: 'any',
          prev: 'import',
          next: 'import'
        }
      ],

      'react/jsx-boolean-value': ['warn'],

      'import/no-unassigned-import': [
        'off',
        {
          allow: ['**/*.css']
        }
      ],

      'import/no-unresolved': ['off'],
      'import/extensions': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'import/order': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/camelcase': ['off'],
      '@typescript-eslint/ban-ts-comment': ['off'],
      '@typescript-eslint/ban-ts-ignore': ['off'],

      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic'
        }
      ],

      '@typescript-eslint/no-extra-semi': ['off'],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      'no-implicit-coercion': ['error'],
      'react/prefer-stateless-function': ['error'],

      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true
        }
      ]
    }
  }
]

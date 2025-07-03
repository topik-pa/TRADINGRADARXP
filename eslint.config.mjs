import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'], rules: {
    eqeqeq: ['error', 'always'],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    'no-debugger': 'error',
    'space-before-function-paren': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }]
  } },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } }
])

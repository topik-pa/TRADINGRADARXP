import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

const nodeRules = {
  eqeqeq: ['error', 'always'],
  semi: ['error', 'never'],
  quotes: ['error', 'single'],
  indent: ['error', 2],
  'comma-dangle': ['error', 'never'],
  'linebreak-style': ['error', 'unix'],
  'no-var': 'error',
  'prefer-const': 'warn',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
  'no-debugger': 'error',
  'space-before-function-paren': ['error', 'never'],
  'object-curly-spacing': ['error', 'always'],
  'arrow-spacing': ['error', { before: true, after: true }],
  'no-console': 'warn'
}


const browserRules = {
  eqeqeq: ['error', 'always'],
  semi: ['error', 'never'],
  quotes: ['error', 'single'],
  indent: ['error', 2],
  'comma-dangle': ['error', 'never'],
  'linebreak-style': ['error', 'unix'],
  'no-var': 'error',
  'prefer-const': 'warn',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
  'no-debugger': 'error',
  'space-before-function-paren': ['error', 'never'],
  'object-curly-spacing': ['error', 'always'],
  'arrow-spacing': ['error', { before: true, after: true }]
}

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'], rules: nodeRules },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  { files: ['app/scripts/**/*.{js,mjs,cjs}', 'app/views/**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser }, rules: browserRules }
])

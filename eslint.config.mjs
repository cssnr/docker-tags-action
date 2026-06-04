import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

// noinspection JSCheckFunctionSignatures
export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      parser: tseslint.parser,
    },
  },
])

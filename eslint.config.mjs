import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'

// noinspection JSCheckFunctionSignatures
export default defineConfig({
    extends: [js.configs.recommended],
    plugins: {
        '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tsParser,
    },
    settings: {
        env: {
            node: true,
            es2021: true,
        },
    },
    rules: {
        'no-undef': 'off',
        'no-extra-semi': 'off',
    },
})

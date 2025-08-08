import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        ignores: ['lib/**', 'generated/**'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.dev.json'],
                tsconfigRootDir: new URL('.', import.meta.url),
                sourceType: 'module',
            },
        },
        rules: {
            'no-unused-expressions': 'off',
        },
    },
    {
        files: ['**/*.js'],
        ignores: ['lib/**', 'generated/**'],
        languageOptions: {
            parserOptions: {
                sourceType: 'module',
            },
        },
    },
]; 
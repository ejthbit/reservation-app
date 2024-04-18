import js from '@eslint/js'
import reactRecommendedPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default [
    js.configs.recommended,
    {
        plugins: { react: reactRecommendedPlugin, 'react-hooks': hooksPlugin },
        rules: {
            'no-undef': 'warn',
            'no-unused-vars': 'warn',
            'react/no-string-refs': 'off',
            'react/display-name': 'off',
            'react/no-direct-mutation-state': 'off',
            'react/prop-types': 'off',
            'react/require-render-return': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]

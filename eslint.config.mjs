import js from '@eslint/js'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'

export default [
    js.configs.recommended,
    reactRecommended,
    {

        rules: {
            'no-undef': 'warn',
            'no-unused-vars': 'warn',
            'react/no-string-refs': 'off',
            'react/display-name': 'off',
            'react/no-direct-mutation-state': 'off',
            'react/prop-types': 'off',
            'react/require-render-return': 'off',
        },
    },
]

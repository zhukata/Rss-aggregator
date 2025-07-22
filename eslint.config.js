import globals from 'globals'
import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },
    plugins: {
      'import': importPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...stylistic.configs.recommended.rules,

      // 🔧 Кастомные правки под твой стиль
      'no-underscore-dangle': [
        'error',
        {
          allow: ['__filename', '__dirname'],
        },
      ],
      'import/extensions': [
        'error',
        {
          js: 'always',
        },
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
]

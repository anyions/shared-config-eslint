import { GLOB_SRC_EXT } from '../globs'
import { interopDefault } from '../shared'
import type { FlatConfigItem } from '../types'

export async function createImportsConfig(): Promise<FlatConfigItem[]> {
  const pluginImport = await interopDefault(import('eslint-plugin-import-x'))
  const pluginUnusedImports = await interopDefault(import('eslint-plugin-unused-imports'))

  return [
    {
      name: `@anyions/shared-eslint-config/imports/rules`,
      plugins: {
        import: pluginImport as any,
        'unused-imports': pluginUnusedImports
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/newline-after-import': ['error', { count: 1 }],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
            pathGroups: [
              {
                group: 'builtin',
                pattern: '{node:}**',
                position: 'before'
              },
              {
                group: 'internal',
                pattern: '{{@,~}/,#}**',
                position: 'before'
              }
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              orderImportKind: 'asc',
              caseInsensitive: true
            }
          }
        ],

        'unused-imports/no-unused-imports': 'warn',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_'
          }
        ]
      }
    },
    {
      name: '@anyions/shared-eslint-config/imports/disables/bin',
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off'
      }
    }
  ]
}

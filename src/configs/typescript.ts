import { GLOB_TS, GLOB_TSX } from '../glob'
import { composer, interopDefault, renamePluginsInRules } from '../shared'
import type { FlatConfigComposer, FlatConfigItem } from '../types'

export async function createTsRules(): Promise<FlatConfigItem['rules']> {
  const pluginTs = await interopDefault(import('@typescript-eslint/eslint-plugin'))

  const tsRules = {
    ...pluginTs.configs.base.rules,
    ...pluginTs.configs.recommended.rules,
    ...pluginTs.configs.strict.rules,

    'no-undef': 'off',

    'ts/ban-ts-comment': 'off',
    'ts/ban-ts-ignore': 'off',
    'ts/ban-types': 'off',

    'ts/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],

    'ts/explicit-module-boundary-types': 'off',
    'ts/prefer-as-const': 'warn',
    'ts/no-empty-function': 'off',
    'ts/no-empty-interface': ['error', { allowSingleExtends: true }],
    'ts/no-explicit-any': 'off',
    'ts/no-import-type-side-effects': 'error',
    'ts/no-non-null-assertion': 'off',
    'ts/no-redeclare': 'error',

    'ts/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],

    'ts/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }

  return renamePluginsInRules(tsRules, { '@typescript-eslint': 'ts' })
}

export async function createTypescriptConfig(): Promise<FlatConfigComposer> {
  const pluginTs = await interopDefault(import('@typescript-eslint/eslint-plugin'))
  const parserTs = await interopDefault(import('@typescript-eslint/parser'))

  const tsRules = await createTsRules()

  const configs: FlatConfigItem[] = [
    {
      name: '@anyions/shared-eslint-config/typescript/rules',
      files: [GLOB_TS, GLOB_TSX],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          sourceType: 'module'
        }
      },
      plugins: {
        ts: pluginTs as any
      },
      rules: {
        ...tsRules
      }
    },
    {
      name: '@anyions/shared-eslint-config/typescript/disables/dts',
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      name: '@anyions/shared-eslint-config/typescript/disables/cjs',
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-var-requires': 'off'
      }
    }
  ]

  return composer(configs)
}

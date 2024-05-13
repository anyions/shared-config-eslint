import process from 'node:process'

import { GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'
import { interopDefault, renamePluginsInRules, toArray } from '../shared'

import type { OptionsTypeScript, TypedFlatConfigItem } from '../types'

export async function createTsRules(): Promise<TypedFlatConfigItem['rules']> {
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

export async function createTypescriptConfig(
  options: boolean | OptionsTypeScript = {}
): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const opts = options as OptionsTypeScript

  const { componentExts = [], overrides = {}, parserOptions = {} } = opts
  const files = opts.files ?? [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)]
  const filesTypeAware = opts.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
  const tsconfigPath = opts?.tsconfigPath ? toArray(opts.tsconfigPath) : undefined
  const isTypeAware = !!tsconfigPath

  const pluginTs = await interopDefault(import('@typescript-eslint/eslint-plugin'))
  const parserTs = await interopDefault(import('@typescript-eslint/parser'))

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',

    'no-implied-eval': 'off',
    'no-throw-literal': 'off',

    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-throw-literal': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/unbound-method': 'error'
  }

  const tsRules = await createTsRules()

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      name: `@anyions/shared-config-eslint/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: 'module',
          ...(typeAware
            ? {
                project: tsconfigPath,
                tsconfigRootDir: process.cwd()
              }
            : {}),
          ...(parserOptions as any)
        }
      }
    }
  }

  return [
    {
      name: '@anyions/shared-config-eslint/typescript/core',
      plugins: {
        ts: pluginTs as any
      }
    },
    ...(isTypeAware
      ? [makeParser(true, filesTypeAware), makeParser(false, files, filesTypeAware)]
      : [makeParser(false, files)]),
    {
      name: '@anyions/shared-config-eslint/typescript/rules',
      files,
      rules: {
        ...tsRules,
        ...overrides
      }
    },
    ...(isTypeAware
      ? [
          {
            name: '@anyions/shared-config-eslint/typescript/type-aware/rules',
            files: filesTypeAware,
            rules: {
              ...(tsconfigPath ? typeAwareRules : {}),
              ...overrides
            }
          }
        ]
      : []),
    {
      name: '@anyions/shared-config-eslint/typescript/disables/dts',
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      name: '@anyions/shared-config-eslint/typescript/disables/cjs',
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-var-requires': 'off'
      }
    }
  ]
}

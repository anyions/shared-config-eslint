import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs'
import { interopDefault, mergeProcessors, processorPassThrough } from '../shared'

import type { FlatConfigItem, OptionsMarkdown } from '../types'

export async function createMarkdownConfig(options: boolean | OptionsMarkdown = {}): Promise<FlatConfigItem[]> {
  if (options === false) return []

  const { componentExts = [], files = [GLOB_MARKDOWN], overrides = {} } = options as OptionsMarkdown

  const markdown = await interopDefault(import('eslint-plugin-markdown'))

  return [
    {
      name: '@anyions/shared-eslint-config/markdown/core',
      plugins: { markdown }
    },
    {
      name: '@anyions/shared-eslint-config/markdown/processor',
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      processor: mergeProcessors([markdown.processors.markdown, processorPassThrough])
    },
    {
      files: [GLOB_MARKDOWN_CODE, ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true
          }
        }
      },
      name: '@anyions/shared-eslint-config/markdown/rules',
      rules: {
        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',

        'style/eol-last': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-var-requires': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        // Type aware rules
        ...{
          'ts/await-thenable': 'off',
          'ts/dot-notation': 'off',
          'ts/no-floating-promises': 'off',
          'ts/no-for-in-array': 'off',
          'ts/no-implied-eval': 'off',
          'ts/no-misused-promises': 'off',
          'ts/no-throw-literal': 'off',
          'ts/no-unnecessary-type-assertion': 'off',
          'ts/no-unsafe-argument': 'off',
          'ts/no-unsafe-assignment': 'off',
          'ts/no-unsafe-call': 'off',
          'ts/no-unsafe-member-access': 'off',
          'ts/no-unsafe-return': 'off',
          'ts/restrict-plus-operands': 'off',
          'ts/restrict-template-expressions': 'off',
          'ts/unbound-method': 'off'
        },

        ...overrides
      }
    }
  ]
}

import { GLOB_PRETTIER_LINT } from 'src/glob'

import { composer, interopDefault } from '../shared'
import type { FlatConfigComposer, FlatConfigItem, PrettierOptions } from '../types'

export async function createPrettierConfig(options: PrettierOptions): Promise<FlatConfigComposer> {
  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'))
  const recommendedPrettier = await interopDefault(import('eslint-plugin-prettier/recommended'))

  const configs: FlatConfigItem[] = [
    recommendedPrettier,
    {
      name: '@anyions/shared-eslint-config/prettier/rules',
      files: GLOB_PRETTIER_LINT,
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        'prettier/prettier': ['warn', options],

        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ]

  return composer(configs)
}

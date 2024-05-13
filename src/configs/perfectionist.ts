import { interopDefault } from '../shared'

import type { TypedFlatConfigItem } from '../types'

export async function createPerfectionistConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return [
    {
      name: '@anyions/shared-config-eslint/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist
      }
    }
  ]
}

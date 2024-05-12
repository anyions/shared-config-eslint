import { interopDefault } from '../shared'

import type { FlatConfigItem } from '../types'

export async function createPerfectionistConfig(): Promise<FlatConfigItem[]> {
  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return [
    {
      name: '@anyions/shared-eslint-config/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist
      }
    }
  ]
}

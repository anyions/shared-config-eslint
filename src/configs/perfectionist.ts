import { composer, interopDefault } from '../shared'
import type { FlatConfigComposer, FlatConfigItem } from '../types'

export async function createPerfectionistConfig(): Promise<FlatConfigComposer> {
  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  const configs: FlatConfigItem[] = [
    {
      name: '@anyions/shared-eslint-config/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist
      }
    }
  ]

  return composer(configs)
}

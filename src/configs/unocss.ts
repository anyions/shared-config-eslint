import { composer, interopDefault } from '../shared'
import type { FlatConfigComposer, FlatConfigItem } from '../types'

export async function createUnocssConfig(): Promise<FlatConfigComposer> {
  const unocss = await interopDefault(import('@unocss/eslint-config/flat'))

  const configs: FlatConfigItem[] = [
    {
      name: '@anyions/shared-eslint-config/unocss/rules',
      plugins: unocss.plugins as any,
      rules: unocss.rules
    }
  ]

  return composer(configs)
}

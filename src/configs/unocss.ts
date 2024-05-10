import { interopDefault } from '../shared'
import type { FlatConfigItem } from '../types'

export async function createUnocssConfig(): Promise<FlatConfigItem[]> {
  const unocss = await interopDefault(import('@unocss/eslint-config/flat'))

  return [
    {
      name: '@anyions/shared-eslint-config/unocss/rules',
      plugins: unocss.plugins as any,
      rules: unocss.rules
    }
  ]
}

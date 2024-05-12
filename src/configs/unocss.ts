import { interopDefault } from '../shared'

import type { FlatConfigItem, OptionsUnoCSS } from '../types'

export async function createUnocssConfig(options: boolean | OptionsUnoCSS = {}): Promise<FlatConfigItem[]> {
  if (options === false) return []

  const { attributify = true, strict = false } = options as OptionsUnoCSS

  const unocss = await interopDefault(import('@unocss/eslint-config/flat'))

  return [
    {
      name: '@anyions/shared-eslint-config/unocss/core',
      plugins: unocss.plugins as any,
      rules: unocss.rules
    },
    {
      name: '@anyions/shared-eslint-config/unocss/rules',
      rules: {
        ...unocss.rules,
        ...(attributify
          ? {
              'unocss/order-attributify': 'warn'
            }
          : {}),
        ...(strict
          ? {
              'unocss/blocklist': 'error'
            }
          : {})
      }
    }
  ]
}

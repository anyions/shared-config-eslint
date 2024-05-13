import { interopDefault } from '../shared'

import type { OptionsUnoCSS, TypedFlatConfigItem } from '../types'

export async function createUnocssConfig(options: boolean | OptionsUnoCSS = {}): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const { attributify = true, strict = false } = options as OptionsUnoCSS

  const unocss = await interopDefault(import('@unocss/eslint-config/flat'))

  return [
    {
      name: '@anyions/shared-config-eslint/unocss/core',
      plugins: unocss.plugins as any,
      rules: unocss.rules
    },
    {
      name: '@anyions/shared-config-eslint/unocss/rules',
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

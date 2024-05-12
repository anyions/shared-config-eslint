import { interopDefault } from '../shared'

import type { FlatConfigItem } from '../types'

export async function createCommentsConfig(): Promise<FlatConfigItem[]> {
  const pluginComments = await interopDefault(import('eslint-plugin-eslint-comments'))

  return [
    {
      name: '@anyions/shared-eslint-config/comments/rules',
      plugins: {
        'eslint-comments': pluginComments
      },
      rules: {
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-enable': 'error'
      }
    }
  ]
}

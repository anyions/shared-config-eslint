import { interopDefault } from '../shared'

import type { TypedFlatConfigItem } from '../types'

export async function createNodeConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginNode = await interopDefault(import('eslint-plugin-n'))

  return [
    {
      name: `@anyions/shared-config-eslint/node/rules`,
      plugins: {
        node: pluginNode
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error'
      }
    }
  ]
}

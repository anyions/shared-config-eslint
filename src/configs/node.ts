import { composer, interopDefault } from '../shared'
import type { FlatConfigComposer, FlatConfigItem } from '../types'

export async function createNodeConfig(): Promise<FlatConfigComposer> {
  const pluginNode = await interopDefault(import('eslint-plugin-n'))

  const configs: FlatConfigItem[] = [
    {
      name: `@anyions/shared-eslint-config/node/rules`,
      plugins: {
        n: pluginNode
      },
      rules: {
        'n/handle-callback-err': ['error', '^(err|error)$'],
        'n/no-deprecated-api': 'error',
        'n/no-exports-assign': 'error',
        'n/no-new-require': 'error',
        'n/no-path-concat': 'error',
        'n/prefer-global/buffer': ['error', 'never'],
        'n/prefer-global/process': ['error', 'never'],
        'n/process-exit-as-throw': 'error'
      }
    }
  ]

  return composer(configs)
}

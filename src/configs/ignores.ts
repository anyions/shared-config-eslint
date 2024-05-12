import { GLOB_EXCLUDES } from '../globs'
import { interopDefault } from '../shared'

import type { FlatConfigItem } from '../types'

export async function createIgnoresConfig(
  ignores: string[] = [],
  flatignores: string[] = []
): Promise<FlatConfigItem[]> {
  const excludes = [...GLOB_EXCLUDES]

  const ignore = await interopDefault(import('eslint-config-flat-gitignore'))

  if (flatignores.length > 0) {
    const config = ignore({ files: flatignores, strict: false })
    excludes.push(...config.ignores)
  }

  return [
    {
      name: '@anyions/shared-eslint-config/ignores/rules',
      ignores: [...excludes, ...ignores]
    }
  ]
}

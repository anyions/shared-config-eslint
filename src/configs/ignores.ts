import fs from 'node:fs'

import { GLOB_EXCLUDES } from '../globs'
import { interopDefault } from '../shared'
import type { FlatConfigItem } from '../types'

export async function createIgnoresConfig(ignores: string[] = []): Promise<FlatConfigItem[]> {
  const gitignore = await interopDefault(import('eslint-config-flat-gitignore'))

  return [
    fs.existsSync('.gitignore') ? gitignore() : {},
    {
      name: '@shared/eslint-config/ignores/rules',
      ignores: [...GLOB_EXCLUDES, ...ignores]
    }
  ]
}

/*
 * Copyright (c) 2020-2024 XtraVisions, All rights reserved.
 */

import fs from 'node:fs'

import { composer, interopDefault } from '../shared'
import type { FlatConfigComposer, FlatConfigItem } from '../types'

export async function createIgnoresConfig(ignores: string[] = []): Promise<FlatConfigComposer> {
  const gitignore = await interopDefault(import('eslint-config-flat-gitignore'))

  const configs: FlatConfigItem[] = [
    fs.existsSync('.gitignore') ? gitignore() : {},
    {
      name: '@shared/eslint-config/ignores/rules',
      ignores: [
        '**/node_modules',
        '**/dist',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        '**/bun.lockb',

        '**/output',
        '**/coverage',
        '**/temp',
        '**/.temp',
        '**/tmp',
        '**/.tmp',
        '**/.history',
        '**/.vitepress/cache',
        '**/.nuxt',
        '**/.next',
        '**/.vercel',
        '**/.changeset',
        '**/.idea',
        '**/.cache',
        '**/.output',
        '**/.vite-inspect',
        '**/.yarn',

        '**/CHANGELOG*.md',
        '**/*.min.*',
        '**/LICENSE*',
        '**/__snapshots__',
        '**/auto-import?(s).d.ts',
        '**/components.d.ts',

        ...ignores
      ]
    }
  ]

  return composer(configs)
}

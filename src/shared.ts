import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { Awaitable, PrettierOptions } from './types'

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export async function loadPrettierConfig(cwd: string) {
  let prettierConfig: PrettierOptions = {}

  try {
    const prettierrc = await readFile(path.join(cwd, '.prettierrc'), 'utf-8')

    prettierConfig = JSON.parse(prettierrc)
  } catch {}

  return prettierConfig
}

export { composer, renamePluginsInRules } from 'eslint-flat-config-utils'

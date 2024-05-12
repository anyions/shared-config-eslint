import type { Awaitable, FlatConfigItem, LinterProcessor } from './types'

export const defaultPluginRenaming = {
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  n: 'node'
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function renameRules(rules: Record<string, any>, map: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      for (const [from, to] of Object.entries(map)) {
        if (key.startsWith(`${from}/`)) return [to + key.slice(from.length), value]
      }
      return [key, value]
    })
  )
}

export function renamePluginInConfigs(configs: FlatConfigItem[], map: Record<string, string>): FlatConfigItem[] {
  return configs.map((i) => {
    const clone = { ...i }
    if (clone.rules) clone.rules = renameRules(clone.rules, map)
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins).map(([key, value]) => {
          if (key in map) return [map[key], value]
          return [key, value]
        })
      )
    }
    return clone
  })
}

export function mergeProcessors(processors: LinterProcessor[]): LinterProcessor {
  const cache = new Map<string, number[]>()

  return {
    meta: {
      name: `merged-processor:${processors.map((processor) => processor.meta?.name || 'unknown').join('+')}`
    },
    supportsAutofix: true,
    preprocess(text, filename) {
      const counts: number[] = []
      cache.set(filename, counts)
      return processors.flatMap((processor) => {
        const result = processor.preprocess?.(text, filename) || []
        counts.push(result.length)
        return result
      })
    },
    postprocess(messages, filename) {
      const counts = cache.get(filename)!
      cache.delete(filename)
      let index = 0
      return processors.flatMap((processor, idx) => {
        const msgs = messages.slice(index, index + counts[idx])
        index += counts[idx]
        return processor.postprocess?.(msgs, filename) || []
      })
    }
  }
}

export const processorPassThrough: LinterProcessor = {
  meta: {
    name: 'pass-through'
  },
  preprocess(text) {
    return [text]
  },
  postprocess(messages) {
    return messages[0]
  }
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export { isPackageExists } from '@anyions/node-pkg'

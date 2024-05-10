import { createCommentsConfig } from './configs/comments'
import { createFormatterConfig } from './configs/formatter'
import { createIgnoresConfig } from './configs/ignores'
import { createImportsConfig } from './configs/imports'
import { createJavascriptConfig } from './configs/javascript'
import { createJsDocConfig } from './configs/jsdoc'
import { createJSONConfig } from './configs/jsonc'
import { createNodeConfig } from './configs/node'
import { createPerfectionistConfig } from './configs/perfectionist'
import { createTypescriptConfig } from './configs/typescript'
import { createUnicornConfig } from './configs/unicorn'
import { createUnocssConfig } from './configs/unocss'
import { createVueConfig } from './configs/vue'
import { createOptions } from './options'
import type { Awaitable, FlatConfigItem, UserOptions } from './types'

export default async function defineConfig(
  options: Partial<UserOptions> = {},
  ...userConfigs: Awaitable<FlatConfigItem>[]
): Promise<FlatConfigItem[]> {
  const opts = await createOptions(options)

  const comments = await createCommentsConfig()
  const formatter = await createFormatterConfig(opts.formatter, opts.prettierRules)
  const ignores = await createIgnoresConfig(opts.ignores)
  const imports = await createImportsConfig()
  const javascript = await createJavascriptConfig()
  const jsdoc = await createJsDocConfig()
  const json = await createJSONConfig()
  const node = await createNodeConfig()
  const perfectionist = await createPerfectionistConfig()
  const typescript = await createTypescriptConfig()
  const unicorn = await createUnicornConfig()
  const unocss = await createUnocssConfig()
  const vue = await createVueConfig()

  const userResolved = await Promise.all(userConfigs)

  return [
    ...ignores,
    ...javascript,
    ...comments,
    ...node,
    ...jsdoc,
    ...imports,
    ...unicorn,
    ...perfectionist,
    ...typescript,
    ...unocss,
    ...vue,
    ...json,
    ...userResolved,
    ...formatter
  ]
}

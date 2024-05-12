import { createCommentsConfig } from './configs/comments'
import { createFormatterConfig } from './configs/formatter'
import { createIgnoresConfig } from './configs/ignores'
import { createImportsConfig } from './configs/imports'
import { createJavascriptConfig } from './configs/javascript'
import { createJsDocConfig } from './configs/jsdoc'
import { createJSONConfig } from './configs/jsonc'
import { createMarkdownConfig } from './configs/markdown'
import { createNodeConfig } from './configs/node'
import { createPerfectionistConfig } from './configs/perfectionist'
import { createTypescriptConfig } from './configs/typescript'
import { createUnicornConfig } from './configs/unicorn'
import { createUnocssConfig } from './configs/unocss'
import { createVueConfig } from './configs/vue'
import { createOptions } from './options'
import { defaultPluginRenaming, renamePluginInConfigs } from './shared'

import type { Awaitable, FlatConfigItem, OptionsTypeScript, UserOptions } from './types'

export default async function defineConfig(
  options: Partial<UserOptions> = {},
  ...userConfigs: Awaitable<FlatConfigItem>[]
): Promise<FlatConfigItem[]> {
  const opts = await createOptions(options)

  const tsOverride = opts.typescript ? (opts.typescript as OptionsTypeScript).overrides : {}

  const comments = await createCommentsConfig()
  const formatter = await createFormatterConfig(opts.prettier)
  const ignores = await createIgnoresConfig(opts.ignores, opts.flatignore)
  const imports = await createImportsConfig()
  const javascript = await createJavascriptConfig(opts.javascript)
  const jsdoc = await createJsDocConfig()
  const json = await createJSONConfig(opts.jsonc)
  const node = await createNodeConfig()
  const markdown = await createMarkdownConfig(opts.markdown)
  const perfectionist = await createPerfectionistConfig()
  const typescript = await createTypescriptConfig(opts.typescript)
  const unicorn = await createUnicornConfig()
  const unocss = await createUnocssConfig(opts.unocss)
  const vue = await createVueConfig(opts.vue, tsOverride)

  const userResolved = await Promise.all(userConfigs)

  const configs = [
    //basic
    ...ignores,
    ...javascript,
    ...comments,
    ...node,
    ...jsdoc,
    ...imports,
    ...unicorn,
    ...perfectionist,
    //optional
    ...typescript,
    ...unocss,
    ...vue,
    ...json,
    ...markdown,
    //userdefined
    ...userResolved,
    //formatter
    ...formatter
  ]

  return renamePluginInConfigs(configs, defaultPluginRenaming)
}

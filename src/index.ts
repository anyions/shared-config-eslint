import process from 'node:process'

import { createFormatterConfig } from './configs/formatter'
import { createIgnoresConfig } from './configs/ignores'
import { createImportsConfig } from './configs/imports'
import { createJavascriptConfig } from './configs/javascript'
import { createNodeConfig } from './configs/node'
import { createPerfectionistConfig } from './configs/perfectionist'
import { createPrettierConfig } from './configs/prettier'
import { createTypescriptConfig } from './configs/typescript'
import { createUnicornConfig } from './configs/unicorn'
import { createUnocssConfig } from './configs/unocss'
import { createVueConfig } from './configs/vue'
import { GLOB_EXCLUDE } from './glob'
import { composer, loadPrettierConfig } from './shared'
import type { Awaitable, FlatConfigComposer, FlatConfigItem, PrettierOptions, UserOptions } from './types'

const DEFAULT_PRETTIER_RULES: PrettierOptions = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  rangeStart: 0
}

async function createOptions(options: Partial<UserOptions> = {}) {
  const opts: UserOptions = {
    cwd: process.cwd(),
    ignores: GLOB_EXCLUDE,
    overrides: {},
    prettierRules: {
      ...DEFAULT_PRETTIER_RULES
    },
    usePrettierrc: true,
    formatter: {
      html: true,
      css: true,
      json: true,
      markdown: true
    }
  }
  const { cwd, ignores, overrides, prettierRules, usePrettierrc, formatter } = options

  if (cwd) {
    opts.cwd = cwd
  }

  if (ignores?.length) {
    opts.ignores = [...opts.ignores, ...ignores]
  }

  if (overrides) {
    opts.overrides = overrides
  }

  if (prettierRules) {
    opts.prettierRules = { ...opts.prettierRules, ...prettierRules }
  }

  if (usePrettierrc !== undefined) {
    opts.usePrettierrc = usePrettierrc
  }

  if (opts.usePrettierrc) {
    const prettierConfig = await loadPrettierConfig(opts.cwd)
    Object.assign(opts.prettierRules, prettierConfig)
  }

  if (formatter) {
    Object.assign(opts.formatter, formatter)
  }

  return opts
}

export default async function defineConfig(
  options: Partial<UserOptions> = {},
  ...userConfigs: Awaitable<FlatConfigItem[]>[]
): Promise<FlatConfigComposer> {
  const opts = await createOptions(options)

  const formatter = await createFormatterConfig(opts.formatter)
  const ignores = await createIgnoresConfig(opts.ignores)
  const imports = await createImportsConfig()
  const javascript = await createJavascriptConfig()
  const node = await createNodeConfig()
  const perfectionist = await createPerfectionistConfig()
  const prettier = await createPrettierConfig(opts.prettierRules)
  const typescript = await createTypescriptConfig()
  const unicorn = await createUnicornConfig()
  const unocss = await createUnocssConfig()
  const vue = await createVueConfig()

  const userResolved = await Promise.all(userConfigs)

  return composer(
    ignores,
    imports,
    javascript,
    node,
    perfectionist,
    typescript,
    unicorn,
    unocss,
    vue,
    ...userResolved,
    prettier,
    formatter
  )
}

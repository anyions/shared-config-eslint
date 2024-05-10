import process from 'node:process'

import { loadPrettierConfig } from './shared'
import type { PrettierRules, UserOptions } from './types'

const DEFAULT_PRETTIER_RULES: PrettierRules = {
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

export async function createOptions(options: Partial<UserOptions> = {}) {
  const opts: UserOptions = {
    cwd: process.cwd(),
    ignores: [],
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

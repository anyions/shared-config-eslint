import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { isPackageExists } from './shared'

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

const DEFAULT_PRETTIER_FORMATTERS = {
  html: true,
  css: true,
  json: true,
  markdown: true
}

const VuePackages = ['vue', 'nuxt', 'vitepress', '@slidev/cli']

async function loadPrettierConfig(cwd: string) {
  let prettierConfig: PrettierRules = {}

  try {
    const prettierrc = await readFile(path.join(cwd, '.prettierrc'), 'utf-8')

    prettierConfig = JSON.parse(prettierrc)
  } catch {}

  return prettierConfig
}

export async function createOptions(options: UserOptions = {}): Promise<UserOptions> {
  const opts: Required<UserOptions> = {
    cwd: process.cwd(),
    ignores: [],
    prettier: {
      rules: DEFAULT_PRETTIER_RULES,
      formatters: DEFAULT_PRETTIER_FORMATTERS
    },
    flatignore: ['.gitignore', '.eslintignore'],
    javascript: {},
    typescript: {},
    vue: {},
    react: {},
    unocss: { attributify: true, strict: false },
    markdown: {},
    jsonc: {}
  }

  const {
    cwd,
    ignores,
    flatignore,
    prettier,
    javascript,
    typescript = isPackageExists('typescript'),
    unocss = false,
    vue = VuePackages.some((i) => isPackageExists(i)),
    react = false,
    markdown = true,
    jsonc = true
  } = options

  //cwd
  if (cwd) {
    opts.cwd = cwd
  }

  //ignores
  if (ignores?.length) {
    opts.ignores = [...opts.ignores, ...ignores]
  }

  //flatignores
  if (typeof flatignore === 'object') {
    opts.flatignore = [...new Set([...opts.flatignore, ...flatignore])]
  }

  //prettier
  if (typeof prettier === 'object') {
    opts.prettier = {
      rules: { ...DEFAULT_PRETTIER_RULES, ...prettier.rules },
      formatters: { ...DEFAULT_PRETTIER_FORMATTERS, ...prettier.formatters }
    }
  } else if (prettier === false) {
    opts.prettier = prettier
  }

  if (typeof opts.prettier === 'object') {
    const prettierConfig = await loadPrettierConfig(opts.cwd)
    Object.assign(opts.prettier!.rules!, prettierConfig)
  }

  //javascript
  if (typeof javascript === 'object') {
    opts.javascript = javascript
  }

  //typescript
  if (typeof typescript === 'object') {
    Object.assign(opts.typescript, typescript)
  } else if (typescript === false) {
    opts.typescript = typescript
  }

  //unocss
  if (typeof unocss === 'object') {
    Object.assign(opts.unocss, unocss)
  } else if (unocss === false) {
    opts.unocss = unocss
  }

  //vue
  if (typeof vue === 'object') {
    Object.assign(opts.vue, vue)
  } else if (vue === false) {
    opts.vue = vue
  }

  //react
  if (typeof react === 'object') {
    Object.assign(opts.react, react)
  } else if (react === false) {
    opts.react = react
  }

  //markdown
  if (typeof markdown === 'object') {
    Object.assign(opts.markdown, markdown)
  } else if (markdown === false) {
    opts.markdown = markdown
  }

  //jsonc
  if (typeof jsonc === 'object') {
    Object.assign(opts.jsonc, jsonc)
  } else if (jsonc === false) {
    opts.jsonc = jsonc
  }

  return opts
}

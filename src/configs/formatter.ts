import {
  GLOB_CSS,
  GLOB_HTML,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_PRETTIER_LINTS,
  GLOB_SCSS,
  GLOB_YAML
} from '../globs'
import { interopDefault } from '../shared'
import type { FlatConfigItem, PrettierParser, PrettierRules, UserOptions } from '../types'

const parserPlain = {
  meta: {
    name: 'eslint-parser-plain'
  },
  parseForESLint: (code: string) => ({
    ast: {
      type: 'Program',
      loc: { start: 0, end: code.length },
      range: [0, code.length],
      body: [],
      comments: [],
      tokens: []
    },
    services: { isPlain: true },
    scopeManager: null,
    visitorKeys: {
      Program: []
    }
  })
}

export async function createFormatterConfig(
  formatters?: UserOptions['formatter'],
  prettierRules: PrettierRules = {}
): Promise<FlatConfigItem[]> {
  const { html = true, css = true, json = true, markdown = true, yaml = false } = formatters || {}

  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'))
  const recommendedPrettier = await interopDefault(import('eslint-plugin-prettier/recommended'))

  function createPrettierFormatter(files: string[], parser: PrettierParser, plugins?: string[]) {
    const rules: PrettierRules = {
      ...prettierRules,
      ...(parser === 'markdown' ? { embeddedLanguageFormatting: 'off' } : {}),
      parser
    }

    if (plugins?.length) {
      rules.plugins = [...(rules.plugins || []), ...plugins]
    }

    const config: FlatConfigItem = {
      name: `@anyions/shared-eslint-config/formatter-${parser}/rules`,
      files,
      languageOptions: {
        parser: parserPlain
      },
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        'prettier/prettier': ['warn', rules]
      }
    }

    return config
  }

  const configs: FlatConfigItem[] = [
    recommendedPrettier,
    {
      name: '@anyions/shared-eslint-config/prettier/rules',
      files: GLOB_PRETTIER_LINTS,
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        'prettier/prettier': ['warn', prettierRules],

        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ]

  if (css) {
    const cssConfig = createPrettierFormatter([GLOB_CSS, GLOB_POSTCSS], 'css')
    const scssConfig = createPrettierFormatter([GLOB_SCSS], 'scss')
    const lessConfig = createPrettierFormatter([GLOB_LESS], 'less')

    configs.push(cssConfig, scssConfig, lessConfig)
  }

  if (html) {
    const htmlConfig = createPrettierFormatter([GLOB_HTML], 'html')
    configs.push(htmlConfig)
  }

  if (json) {
    const jsonConfig = createPrettierFormatter([GLOB_JSON, GLOB_JSONC], 'json')
    const json5Config = createPrettierFormatter([GLOB_JSON5], 'json5')
    configs.push(jsonConfig, json5Config)
  }

  if (markdown) {
    const markdownConfig = createPrettierFormatter([GLOB_MARKDOWN], 'markdown')
    configs.push(markdownConfig)
  }

  if (yaml) {
    const yamlConfig = createPrettierFormatter([GLOB_YAML], 'yaml')
    configs.push(yamlConfig)
  }

  return configs
}

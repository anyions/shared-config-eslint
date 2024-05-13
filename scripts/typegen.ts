import fs from 'node:fs/promises'

import { builtinRules } from 'eslint/use-at-your-own-risk'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'

import { createCommentsConfig } from '../src/configs/comments'
import { createFormatterConfig } from '../src/configs/formatter'
import { createIgnoresConfig } from '../src/configs/ignores'
import { createImportsConfig } from '../src/configs/imports'
import { createJavascriptConfig } from '../src/configs/javascript'
import { createJsDocConfig } from '../src/configs/jsdoc'
import { createJSONConfig } from '../src/configs/jsonc'
import { createMarkdownConfig } from '../src/configs/markdown'
import { createNodeConfig } from '../src/configs/node'
import { createPerfectionistConfig } from '../src/configs/perfectionist'
import { createTypescriptConfig } from '../src/configs/typescript'
import { createUnicornConfig } from '../src/configs/unicorn'
import { createUnocssConfig } from '../src/configs/unocss'
import { createVueConfig } from '../src/configs/vue'

const configs = await Promise.all([
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries())
      }
    },
    name: undefined
  },
  createCommentsConfig(),
  createFormatterConfig(),
  createIgnoresConfig(),
  createImportsConfig(),
  createJavascriptConfig(),
  createJsDocConfig(),
  createJSONConfig(),
  createNodeConfig(),
  createMarkdownConfig(),
  createPerfectionistConfig(),
  createTypescriptConfig(),
  createUnicornConfig(),
  createUnocssConfig(),
  createVueConfig()
]).then((c) => c.flat())

const configNames = configs.map((i) => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typesgen.d.ts', dts)

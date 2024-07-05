# @anyions/shared-config-eslint

[![NPM version](https://img.shields.io/npm/v/@anyions/shared-config-eslint?color=a1b858&label=)](https://www.npmjs.com/package/@anyions/shared-config-eslint) ![NPM License](https://img.shields.io/npm/l/@anyions/shared-config-eslint) ![Static Badge](https://img.shields.io/badge/author-AnyIons-blue)

**AnyIons' shared ESLint flat config presets with prettier.**

- Default ESLint flat config for JavaScript, TypeScript, Vue and UnoCSS.
- Use ESlint and Prettier to format HTML, CSS, LESS, SCSS, JSON, JSONC, Markdown.

## Install

```bash
npm i @anyions/shared-config-eslint
```

## Usage

### ESLint config file

- With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json`

- Create config file `eslint.config.js`

- Import config from `@anyions/shared-config-eslint`

```js
import { defineConfig } from '@anyions/shared-config-eslint'

export default defineConfig(
  {
    // user options
  },
  // From the second arguments they are ESLint flat configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {
      //...
    }
  },
  {
    rules: {
      //...
    }
  }
)
```

> [!NOTE]  
> See [Options](#options) for more details.

### ESLint settings in VSCode

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "eslint.experimental.useFlatConfig": true,
  "editor.formatOnSave": true,
  "eslint.format.enable": true,
  "eslint.ignoreUntitled": true,
  "eslint.validate": [
    // add the languages you want to lint
    "html",
    "css",
    "json",
    "jsonc",
    "json5",
    "markdown",
    "yaml",
    "yml"
  ],
  "prettier.enable": false
}
```

### Scripts in package.json

```json
{
  "scripts": {
    "lint": "eslint ."
    "lint:fix": "eslint . --cache --max-warnings 0 --fix",
  }
}
```

## Options

````ts
interface OptionsPrettier {
  /**
   * Default prettier rules
   *
   * @default
   * ```json
   * {
   *   "printWidth": 120,
   *   "tabWidth": 2,
   *   "useTabs": false,
   *   "semi": false,
   *   "vueIndentScriptAndStyle": true,
   *   "singleQuote": true,
   *   "quoteProps": "as-needed",
   *   "bracketSpacing": true,
   *   "trailingComma": "none",
   *   "jsxSingleQuote": true,
   *   "arrowParens": "always",
   *   "proseWrap": "never",
   *   "htmlWhitespaceSensitivity": "strict",
   *   "endOfLine": "lf",
   *   "rangeStart": 0
   * }
   * ```
   */
  rules: PrettierRules
  /**
   * @default
   * {
   *  "html": true,
   *  "css": true,
   *  "json": true,
   *  "markdown": true,
   *  "yaml": false
   * }
   */
  formatters: {
    html?: boolean
    css?: boolean
    json?: boolean
    markdown?: boolean
    yaml?: false
  }
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue', 'ts']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsOverrides {
  files?: string[]
  overrides?: FlatConfigItem['rules']
}

export interface OptionsMarkdown extends OptionsOverrides, OptionsComponentExts {}

export interface OptionsTypeScript extends OptionsOverrides, OptionsComponentExts {
  tsconfigPath?: string | string[]
  parserOptions?: Partial<ParserOptions>
  filesTypeAware?: string[]
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface UserOptions {
  /**
   * The current working directory
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * The globs to ignore lint
   *
   * @default []
   */
  ignores?: string[]
  /**
   * Enable flat git/eslint ignore support.
   *
   * Path to `.gitignore` files
   * By defult, will use `'.gitignore'` and '.eslintignore' automation.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   *
   * @default ['.gitignore', '.eslintignore']
   */
  flatignore?: string[]
  /**
   * Whether to use prettier to format files
   * If true, will use default prettier options
   * You can use `.prettierrc` to override the default prettier rules
   *
   * @see OptionsPrettier
   * @default true
   */
  prettier?: boolean | OptionsPrettier
  /**
   * Javascript override rules.
   */
  javascript?: OptionsOverrides
  /**
   * Enable TypeScript support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypeScript
  /**
   * Enable unocss rules.
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS
  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsOverrides
  /**
   * Enable React support.
   *
   * @default false
   */
  react?: boolean | OptionsOverrides
  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * To format Markdown content, need enable `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsMarkdown
  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides
}
````

## Plugins Renaming

Since flat config requires explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix | Source Plugin |
| --- | --- | --- |
| `import/*` | `import-x/*` | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x) |
| `node/*` | `n/*` | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) |
| `yaml/*` | `yml/*` | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) |
| `ts/*` | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*` | `@stylistic/*` | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic) |
| `test/*` | `vitest/*` | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest) |
| `test/*` | `no-only-tests/*` | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests) |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

## Config Composer

The function `defineConfig()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import defineConfig from '@anyions/shared-config-eslint'

export default defineConfig()
  .prepend(
    // some configs before the main config
  )
  // overrides any named configs
  .override(
    'antfu/imports',
    {
      rules: {
        'import/order': ['error', { 'newlines-between': 'always' }],
      }
    }
  )
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  })
// ...
```

## Thanks

**Inspired by the following projects:**

- [Antfu's eslint-config](https://github.com/antfu/eslint-config)
- [SoybeanJS's eslint-config](https://github.com/soybeanjs/eslint-config)

## License

[MIT](./LICENSE) License © 2020 [AnyIons](https://github.com/anyions)

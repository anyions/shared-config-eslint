# @anyions/shared-eslint-config

[![NPM version](https://img.shields.io/npm/v/@anyions/shared-eslint-config?color=a1b858&label=)](https://www.npmjs.com/package/@anyions/shared-eslint-config)

**AnyIons' shared ESLint flat config presets with prettier.**

- Default ESLint flat config for JavaScript, TypeScript, Vue and UnoCSS.
- Use ESlint and Prettier to format HTML, CSS, LESS, SCSS, JSON, JSONC, YAML, Markdown.

## Install

```bash
npm i @anyions/shared-eslint-config
```

## Usage

### ESLint config file

- With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json`

- Create config file `eslint.config.js`

- Import config from `@anyions/shared-eslint-config`

```js
import { defineConfig } from "@anyions/eslint-config";

export default defineConfig(
  {
    // user options
  },
  // From the second arguments they are ESLint flat configs
  // you can have multiple configs
  {
    files: ["**/*.ts"],
    rules: {},
  },
  {
    rules: {},
  },
);
```

> [!NOTE] See [Options](#options) for more details.

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
interface UserOptions {
  /**
   * The current working directory
   *
   * @default process.cwd()
   */
  cwd: string;
  /** The globs to ignore lint */
  ignores: string[];
  /** The override rules */
  overrides: FlatConfigItem["rules"];
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
  prettierRules: PrettierRules;
  /**
   * Whether to use prettierrc
   *
   * If true, the rules in prettierrc will override the default rules
   *
   * @default true
   */
  usePrettierrc: boolean;
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
  formatter: {
    html?: boolean;
    css?: boolean;
    json?: boolean;
    markdown?: boolean;
    yaml?: false;
  };
}
````

## Thanks

**Inspired by the following projects:**

- [Antfu's eslint-config](https://github.com/antfu/eslint-config)
- [SoybeanJS's eslint-config](https://github.com/soybeanjs/eslint-config)

## License

[MIT](./LICENSE) License © 2020 [AnyIons](https://github.com/anyions)

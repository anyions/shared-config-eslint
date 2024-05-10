import type { ESLint, Linter } from 'eslint'

interface PrettierRulessRequired {
  /**
   * Specify the line length that the printer will wrap on.
   * @default 120
   */
  printWidth: number
  /**
   * Specify the number of spaces per indentation-level.
   */
  tabWidth: number
  /**
   * Indent lines with tabs instead of spaces
   */
  useTabs?: boolean
  /**
   * Print semicolons at the ends of statements.
   */
  semi: boolean
  /**
   * Use single quotes instead of double quotes.
   */
  singleQuote: boolean
  /**
   * Use single quotes in JSX.
   */
  jsxSingleQuote: boolean
  /**
   * Print trailing commas wherever possible.
   */
  trailingComma: 'none' | 'es5' | 'all'
  /**
   * Print spaces between brackets in object literals.
   */
  bracketSpacing: boolean
  /**
   * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   */
  bracketSameLine: boolean
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: boolean
  /**
   * Format only a segment of a file.
   */
  rangeStart: number
  /**
   * Format only a segment of a file.
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default "preserve"
   */
  proseWrap: 'always' | 'never' | 'preserve'
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens: 'avoid' | 'always'
  /**
   * Provide ability to support new languages to prettier.
   */
  plugins: Array<string | any>
  /**
   * How to handle whitespaces in HTML.
   * @default "css"
   */
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore'
  /**
   * Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine: 'auto' | 'lf' | 'crlf' | 'cr'
  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps: 'as-needed' | 'consistent' | 'preserve'
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: boolean
  /**
   * Enforce single attribute per line in HTML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: boolean
}

export type PrettierParser =
  | 'acorn'
  | 'angular'
  | 'babel-flow'
  | 'babel-ts'
  | 'babel'
  | 'css'
  | 'espree'
  | 'flow'
  | 'glimmer'
  | 'graphql'
  | 'html'
  | 'json-stringify'
  | 'json'
  | 'json5'
  | 'less'
  | 'lwc'
  | 'markdown'
  | 'mdx'
  | 'meriyah'
  | 'scss'
  | 'typescript'
  | 'vue'
  | 'yaml'

// eslint-disable-next-line no-use-before-define
export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & { _?: never | undefined })

export type FlatConfigParserModule = Linter.FlatConfigParserModule

export interface PrettierRules extends Partial<PrettierRulessRequired> {
  parser?: LiteralUnion<PrettierParser>
}

export interface FlatConfigItem extends Linter.FlatConfig {}

export interface ESLintPlugin extends ESLint.Plugin {}

export interface UserOptions {
  /**
   * The current working directory
   *
   * @default process.cwd()
   */
  cwd: string
  /** The globs to ignore lint */
  ignores: string[]
  /** The override rules */
  overrides: FlatConfigItem['rules']
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
  prettierRules: PrettierRules
  /**
   * Whether to use prettierrc
   *
   * If true, the rules in prettierrc will override the default rules
   *
   * @default true
   */
  usePrettierrc: boolean
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
    html?: boolean
    css?: boolean
    json?: boolean
    markdown?: boolean
    yaml?: false
  }
}

export { type Awaitable, type FlatConfigComposer } from 'eslint-flat-config-utils'

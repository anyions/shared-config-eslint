import { GLOB_VUE } from '../globs'
import { interopDefault } from '../shared'

import { createTsRules } from './typescript'

import type { FlatConfigItem, OptionsOverrides } from '../types'

export async function createVueConfig(
  options: boolean | OptionsOverrides = {},
  tsOverrides: FlatConfigItem['rules'] = {}
): Promise<FlatConfigItem[]> {
  if (options === false) return []

  const { files = [GLOB_VUE], overrides = {} } = options as OptionsOverrides

  const [pluginVue, parserVue, parserTs] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('@typescript-eslint/parser'))
  ])

  const tsRules = await createTsRules()

  return [
    {
      name: '@anyions/shared-eslint-config/vue/rules',
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly'
        }
      },
      plugins: {
        vue: pluginVue
      }
    },
    {
      name: '@anyions/shared-eslint-config/vue/rules',
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          parser: parserTs,
          extraFileExtensions: ['.vue'],
          sourceType: 'module'
        }
      },
      processor: pluginVue.processors!['.vue'],
      rules: {
        ...tsRules,
        ...tsOverrides,
        ...pluginVue.configs.base.rules,
        ...pluginVue.configs['vue3-essential'].rules,
        ...pluginVue.configs['vue3-strongly-recommended'].rules,
        ...pluginVue.configs['vue3-recommended'].rules,

        'node/prefer-global/process': 'off',

        'vue/attribute-hyphenation': 'off',
        'vue/block-order': [
          'error',
          {
            order: ['template', 'script', 'style']
          }
        ],

        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
          }
        ],
        'vue/define-props-declaration': ['warn', 'type-based'],

        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],

        'vue/eqeqeq': ['error', 'smart'],

        'vue/html-indent': ['error', 2],
        'vue/html-quotes': ['error', 'double'],
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 'off',

        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-for-template-key-on-child': 'off',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/script-setup-uses-vars': 'error',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        //styllistic
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always'
          }
        ],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-']
          }
        ],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/template-curly-spacing': 'error',

        ...overrides
      }
    }
  ]
}

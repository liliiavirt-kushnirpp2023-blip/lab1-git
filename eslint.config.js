import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'vue/no-unused-vars': 'error',
      'vue/html-self-closing': 'off',
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  }
]
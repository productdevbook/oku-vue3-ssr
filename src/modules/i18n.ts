import {createI18n} from 'vue-i18n'

import messages from '@intlify/vite-plugin-vue-i18n/messages'

export const monoRepoI18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
  fallbackWarn: false,
})

export const install = ({app}) => {
  app.use(monoRepoI18n)
}

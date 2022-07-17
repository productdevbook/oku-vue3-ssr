import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'

const config: UserConfig = {
  plugins: [
    vue(),
    Components(),
    ssr({
      prerender: true,
    }),
  ],
}

export default config

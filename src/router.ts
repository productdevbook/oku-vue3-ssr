import {
  NavigationGuard,
  NavigationHookAfter,
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router'

import * as NProgress from 'nprogress'

/**
 * routes are generated using vite-plugin-pages
 * each .vue files located in the ./src/pages are registered as a route
 * @see https://github.com/hannoeru/vite-plugin-pages/blob/main/examples/vue/src/main.ts
 */

import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

export const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
})

/**
 * Handle NProgress display on page changes
 */
export const onBeforeEach: NavigationGuard = async () => {
  NProgress.start()
}

export const afterEach: NavigationHookAfter = async () => {
  NProgress.done(true)
}
router.beforeEach(onBeforeEach)
router.afterEach(afterEach)

export default router

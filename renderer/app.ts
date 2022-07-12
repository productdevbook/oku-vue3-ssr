import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'

// extensions
import { createPinia, setActivePinia } from 'pinia'

import { setPageContext } from './usePageContext'
import type { Component, PageContext } from './types'
import PageShell from './PageShell.vue'
import 'uno.css'
import '#root/src/assets/base.css'

const pinia = createPinia()
setActivePinia(pinia)

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let rootComponent: Component
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {}),
    }),
    created() {
      rootComponent = this as Component
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          },
        },
      )
    },
  })

  const app = createSSRApp(PageWithWrapper)

  app.use(pinia)
  const pageContextReactive = reactive(pageContext)

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    },
  })

  setPageContext(app, pageContextReactive)

  return app
}

function objectAssign<Obj, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

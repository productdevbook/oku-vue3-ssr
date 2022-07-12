export interface PageProps {}
// The `pageContext` that are available in both on the server-side and browser-side
export interface PageContext {
  Page: any
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
  pageExports: {
    documentProps?: {
      title: string
    }
  }
  urlPathname?: string
}

export type Component = any

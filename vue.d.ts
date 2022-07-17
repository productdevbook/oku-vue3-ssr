// vite-env.d.ts
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  const Component: any
  export default Component
}

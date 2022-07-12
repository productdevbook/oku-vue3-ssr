import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'appStore',
  state: () => ({
    progressRouter: false,
    sidebarOpen: false,
    stutus: '' as 'writing' | 'reading' | 'null',
    fullScreen: false,
    hydrated: false,
    hydrating: false,
    error: null,
    authenticated: false,
    accessTokenExpiry: 0,
    appAccess: true,
    basemap: 'OpenStreetMap',
    isModalWindow: false,
    userLayoutSmall: false,
  }),
  getters: {
    getProgressRouter: state => state.progressRouter,
    isSidebar: state => state.sidebarOpen,
    getStatus: state => state.stutus,
  },
  actions: {
    async hydrate() {},
  },
})

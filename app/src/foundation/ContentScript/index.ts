export function setupContentScriptHMR() {
  if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import('/@vite/client')
    // load latest content script
    import('./hmr')
  }
}

export function setupDebug({ onMessage }: { onMessage: (event: CustomEvent) => void }) {
  window.__companion = { log }

  const listener = (event: any) => {
    onMessage(event)
  }

  window.addEventListener('companion-log', listener)

  return () => window.removeEventListener('companion-log', listener)
}

export function log(...message: any[]) {
  const event = new CustomEvent('companion-log', {
    detail: {
      message,
    },
  })
  window.dispatchEvent(event)
}

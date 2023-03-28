/**
 * Monkeypatch console.log to instead send a custom event and proxy logs from an extension script to the main webpage.
 */
export function setupDebug({
  onMessage,
}: {
  onMessage: (event: CustomEvent) => void;
}) {
  console.log = log;

  const listener = (event: any) => {
    onMessage(event);
  };

  window.addEventListener('aside-log', listener);

  return () => window.removeEventListener('aside-log', listener);
}

export function log(...message: any[]) {
  const event = new CustomEvent('aside-log', {
    detail: {
      message,
    },
  });
  window.dispatchEvent(event);
}

type AuthMessage = { type: 'logout' }

const channel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth') : null

/** Serializa el refresh entre pestañas cuando el navegador soporta Web Locks. */
export async function withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('auth-refresh', () => fn())
  }
  return fn()
}

export function broadcastLogout(): void {
  channel?.postMessage({ type: 'logout' } satisfies AuthMessage)
}

export function onAuthMessage(handler: (message: AuthMessage) => void): () => void {
  if (!channel) return () => {}
  const listener = (event: MessageEvent<AuthMessage>) => handler(event.data)
  channel.addEventListener('message', listener)
  return () => channel.removeEventListener('message', listener)
}

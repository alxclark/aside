import type { PropsWithChildren } from 'react'

export function Button({ children }: PropsWithChildren<{}>) {
  return <button>{children}</button>
}

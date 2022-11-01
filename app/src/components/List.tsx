import React from 'react'
import type { PropsWithChildren } from 'react'

export function List({ children }: PropsWithChildren<{}>) {
  return <ul>{children}</ul>
}

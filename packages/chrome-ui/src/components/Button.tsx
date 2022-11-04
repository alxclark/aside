import React, { PropsWithChildren } from "react";

export function Button({children}: PropsWithChildren<{}>) {
  return (
    <button className="p-4">{children}</button>
  )
}

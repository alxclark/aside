import React from 'react';

export interface Props {
  children?: React.ReactNode;
}

export function TableCell({children}: Props) {
  return <td className="border-gray-400 border-x px-1 truncate">{children}</td>;
}

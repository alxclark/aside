import React from 'react';

export function NumberRenderer({value}: {value: number}) {
  return <span className="text-console-number">{value}</span>;
}

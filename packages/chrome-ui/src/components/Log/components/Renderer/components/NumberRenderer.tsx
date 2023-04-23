import React from 'react';

export function NumberRenderer({value}: {value: number}) {
  return <span className="text-console-object-purple">{value}</span>;
}

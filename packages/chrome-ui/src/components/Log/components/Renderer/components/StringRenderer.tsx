import React from 'react';

export function StringRenderer({value}: {value: string}) {
  return <span className="text-console-object-cyan">&quot;{value}&quot;</span>;
}
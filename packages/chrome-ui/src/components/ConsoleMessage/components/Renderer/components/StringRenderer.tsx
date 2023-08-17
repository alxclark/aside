import React from 'react';

export function StringRenderer({value}: {value: string}) {
  return <span className="text-console-string">&quot;{value}&quot;</span>;
}

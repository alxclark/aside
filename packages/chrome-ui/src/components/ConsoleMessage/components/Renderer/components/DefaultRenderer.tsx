import React from 'react';

export function DefaultRenderer({value}: {value: any}) {
  return <span className="text-console-object-gray">{value}</span>;
}

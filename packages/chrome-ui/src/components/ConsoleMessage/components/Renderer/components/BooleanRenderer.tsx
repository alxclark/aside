import React from 'react';

export function BooleanRenderer({value}: {value: boolean}) {
  return <span className="text-console-boolean">{JSON.stringify(value)}</span>;
}

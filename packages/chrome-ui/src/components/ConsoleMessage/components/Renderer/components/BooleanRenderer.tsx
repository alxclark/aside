import React from 'react';

export function BooleanRenderer({value}: {value: boolean}) {
  return (
    <span className="text-console-object-purple">{JSON.stringify(value)}</span>
  );
}

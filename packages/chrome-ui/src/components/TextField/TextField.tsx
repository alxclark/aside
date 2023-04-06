import React from 'react';

export interface Props {
  id: string;
  placeholder?: string;
  onChange?(value: string): void;
}

export function TextField({id, placeholder, onChange}: Props) {
  return (
    <input
      className="bg-background placeholder:text-text-secondary"
      placeholder={placeholder}
      autoComplete={id}
      onChange={(event) => onChange?.(event.currentTarget.value)}
    />
  );
}

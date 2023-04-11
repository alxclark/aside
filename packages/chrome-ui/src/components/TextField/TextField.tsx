import classNames from 'classnames';
import React from 'react';

export interface Props {
  id: string;
  placeholder?: string;
  onChange?(value: string): void;
  value?: string;
}

export function TextField({id, placeholder, onChange, value}: Props) {
  const hasValue = value && value.length > 0;

  return (
    <input
      className={classNames(
        'text-gray-100 bg-background h-[20px] pl-[3px] w-full',
        hasValue
          ? 'border-input-active'
          : 'border-elevation-1 hover:border-gray-400',
        'border',
        'placeholder:text-text-secondary focus-visible:outline-none focus:border-input-active',
      )}
      value={value}
      placeholder={placeholder}
      autoComplete={id}
      onChange={(event) => onChange?.(event.currentTarget.value)}
    />
  );
}

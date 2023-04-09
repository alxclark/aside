import classNames from 'classnames';
import React from 'react';

export interface Props {
  id: string;
  placeholder?: string;
  onChange?(value: string): void;
  value?: string;
}

export function TextField({id, placeholder, onChange, value}: Props) {
  return (
    <input
      className={classNames(
        'text-gray-100 bg-background h-[20px] pl-[3px]',
        'border border-elevation-1',
        'placeholder:text-text-secondary focus-visible:outline-none hover:border-gray-400 focus:border-input-active',
        value && value.length > 0 && 'border-input-active',
      )}
      value={value}
      placeholder={placeholder}
      autoComplete={id}
      onChange={(event) => onChange?.(event.currentTarget.value)}
    />
  );
}

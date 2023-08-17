import React from 'react';
import {TextFieldProps} from '@aside/chrome-ui-remote';
import classNames from 'classnames';

export type {TextFieldProps};

export function TextField({id, placeholder, onChange, value}: TextFieldProps) {
  const hasValue = value && value.length > 0;

  return (
    <input
      className={classNames(
        'text-foreground bg-background h-[20px] pl-[3px] w-full',
        hasValue ? 'border-ring' : 'border-primary hover:border-border',
        'border',
        'placeholder:text-primary-foreground focus-visible:outline-none focus:border-ring',
      )}
      value={value}
      placeholder={placeholder}
      autoComplete={id}
      onChange={(event) => onChange?.(event.currentTarget.value)}
    />
  );
}

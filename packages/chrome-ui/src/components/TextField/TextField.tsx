import React from 'react';
import {TextFieldProps} from '@aside/chrome-ui-remote';
import classNames from 'classnames';

export function TextField({id, placeholder, onChange, value}: TextFieldProps) {
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

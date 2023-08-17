import React from 'react';
import {CheckboxProps} from '@aside/chrome-ui-remote';

export type {CheckboxProps};

export function Checkbox({label, checked, onChange, id}: CheckboxProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        id={id}
        className="accent-checkbox-accent bg-transparent"
        type="checkbox"
        onChange={() => onChange()}
        checked={checked}
      />
      <label className="ml-1 text-primary-foreground" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

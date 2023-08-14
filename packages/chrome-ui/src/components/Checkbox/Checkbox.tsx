import React from 'react';
import {CheckboxProps} from '@aside/chrome-ui-remote';

export type {CheckboxProps};

export function Checkbox({label, checked, onChange, id}: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        className="accent-checkbox-accent bg-transparent m-[3px] ml-1"
        type="checkbox"
        onChange={() => onChange()}
        checked={checked}
      />
      <label className="ml-[3px] text-gray-300" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

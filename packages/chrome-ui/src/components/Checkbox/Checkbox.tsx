import React from 'react';

export interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange(): void;
}

export function Checkbox({label, checked, onChange, id}: Props) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        className="accent-checkbox-accent bg-transparent m-[3px] ml-1"
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <label className="ml-1 text-gray-300" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

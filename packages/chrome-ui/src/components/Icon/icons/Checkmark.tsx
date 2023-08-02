import React from 'react';

import type {Props} from '../Icon';

export function Checkmark({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.07199 8.049L2.797 9.324L6.623 13.149L14.275 5.498L13 4.222L6.623 10.6L4.07199 8.049Z"
        fill={color}
      />
    </svg>
  );
}

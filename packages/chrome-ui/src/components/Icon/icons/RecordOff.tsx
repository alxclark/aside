import React from 'react';

import type {Props} from '../Icon';

export function RecordOff({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 6C0 9.31 2.69 12 6 12C9.31 12 12 9.31 12 6C12 2.69 9.31 0 6 0C2.69 0 0 2.69 0 6Z"
        fill={color}
      />
    </svg>
  );
}

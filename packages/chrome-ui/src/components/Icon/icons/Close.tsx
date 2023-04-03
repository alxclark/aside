import React from 'react';

import type {Props} from '../Icon';

export function Close({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={height}
      height={width}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1.33L8.67 0L5 3.67L1.33 0L0 1.33L3.67 5L0 8.67L1.33 10L5 6.33L8.67 10L10 8.67L6.33 5L10 1.33Z"
        fill={color}
      />
    </svg>
  );
}

<svg
  width="10"
  height="10"
  viewBox="0 0 10 10"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M10 1.33L8.67 0L5 3.67L1.33 0L0 1.33L3.67 5L0 8.67L1.33 10L5 6.33L8.67 10L10 8.67L6.33 5L10 1.33Z"
    fill="black"
  />
</svg>;

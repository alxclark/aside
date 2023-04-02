import React from 'react';

import type {Props} from '../Icon';

export function Cancel({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={height}
      height={width}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.44 10.94C3.96 10.94 1.94 8.92 1.94 6.44C1.94 5.56 2.2 4.74 2.63 4.05L8.83 10.25C8.14 10.69 7.32 10.94 6.44 10.94ZM10.94 6.44C10.94 7.32 10.68 8.14 10.25 8.83L4.05 2.63C4.74 2.19 5.56 1.94 6.44 1.94C8.92 1.94 10.94 3.96 10.94 6.44ZM6.5 0C4.77609 0 3.12279 0.684822 1.90381 1.90381C0.684819 3.1228 0 4.77609 0 6.5C0 8.22391 0.684819 9.8772 1.90381 11.0962C3.12279 12.3152 4.77609 13 6.5 13C8.22391 13 9.87721 12.3152 11.0962 11.0962C12.3152 9.8772 13 8.22391 13 6.5C13 4.77609 12.3152 3.1228 11.0962 1.90381C9.87721 0.684822 8.22391 0 6.5 0Z"
        fill={color}
      />
    </svg>
  );
}

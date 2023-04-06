import React from 'react';

import type {Props} from '../Icon';

export function VerticalEllipsis({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 4 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.98901 1.5C3.98901 1.89782 3.83098 2.27935 3.54967 2.56065C3.26837 2.84196 2.88684 3 2.48901 3C2.09119 3 1.70966 2.84196 1.42835 2.56065C1.14705 2.27935 0.989014 1.89782 0.989014 1.5C0.989014 1.10218 1.14705 0.720643 1.42835 0.439339C1.70966 0.158034 2.09119 0 2.48901 0C2.88684 0 3.26837 0.158034 3.54967 0.439339C3.83098 0.720643 3.98901 1.10218 3.98901 1.5ZM3.98901 6.5C3.98901 6.89782 3.83098 7.27935 3.54967 7.56065C3.26837 7.84196 2.88684 8 2.48901 8C2.09119 8 1.70966 7.84196 1.42835 7.56065C1.14705 7.27935 0.989014 6.89782 0.989014 6.5C0.989014 6.10218 1.14705 5.72065 1.42835 5.43935C1.70966 5.15804 2.09119 5 2.48901 5C2.88684 5 3.26837 5.15804 3.54967 5.43935C3.83098 5.72065 3.98901 6.10218 3.98901 6.5ZM3.98901 11.5C3.98901 11.8978 3.83098 12.2793 3.54967 12.5607C3.26837 12.842 2.88684 13 2.48901 13C2.09119 13 1.70966 12.842 1.42835 12.5607C1.14705 12.2793 0.989014 11.8978 0.989014 11.5C0.989014 11.1022 1.14705 10.7207 1.42835 10.4393C1.70966 10.158 2.09119 10 2.48901 10C2.88684 10 3.26837 10.158 3.54967 10.4393C3.83098 10.7207 3.98901 11.1022 3.98901 11.5Z"
        fill={color}
      />
    </svg>
  );
}

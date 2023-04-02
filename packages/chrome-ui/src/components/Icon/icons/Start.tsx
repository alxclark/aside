import React from 'react';

import type {Props} from '../Icon';

export function Start({height, width, color}: Omit<Props, 'source'>) {
  return (
    <svg
      style={{height, width}}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 96 960 960"
      fill={color ?? 'currentColor'}
    >
      <path d="M80 816V336h60v480H80Zm559 1-43-42 169-169H239v-60h526L597 377l42-42 241 241-241 241Z" />
    </svg>
  );
}

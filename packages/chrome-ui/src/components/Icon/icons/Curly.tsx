import React from 'react';

import type {Props} from '../Icon';

export function Curly({height, width, color}: Omit<Props, 'source'>) {
  return (
    <svg
      style={{height, width}}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 96 960 960"
      fill={color ?? 'currentColor'}
    >
      <path d="M570 896v-60h120q21 0 35.5-14.375T740 786V686q0-37 22.5-66t57.5-40v-8q-35-10-57.5-39.5T740 466V366q0-21.25-14.375-35.625T690 316H570v-60h120q46 0 78 32.083 32 32.084 32 77.917v100q0 21.25 14.375 35.625T850 516h30v120h-30q-21.25 0-35.625 14.375T800 686v100q0 45.833-32.083 77.917Q735.833 896 690 896H570Zm-300 0q-46 0-78-32.083-32-32.084-32-77.917V686q0-21.25-14.375-35.625T110 636H80V516h30q21.25 0 35.625-14.375T160 466V366q0-45.833 32.083-77.917Q224.167 256 270 256h120v60H270q-21 0-35.5 14.375T220 366v100q0 37-22.5 66.5T140 572v8q35 11 57.5 40t22.5 66v100q0 21.25 14.375 35.625T270 836h120v60H270Z" />
    </svg>
  );
}

import React from 'react';

import type {Props} from '../Icon';

export function RecordOn({
  height,
  width,
  color = 'currentColor',
}: Omit<Props, 'source'>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.38846e-08 8.99999C6.56191e-05 10.182 0.232925 11.3523 0.685303 12.4443C1.13768 13.5363 1.80072 14.5284 2.63654 15.3642C3.47236 16.1999 4.46459 16.8628 5.55661 17.3151C6.64863 17.7673 7.81904 18.0001 9.00101 18C10.183 17.9999 11.3533 17.7671 12.4453 17.3147C13.5373 16.8623 14.5294 16.1993 15.3652 15.3635C16.2009 14.5276 16.8638 13.5354 17.3161 12.4434C17.7683 11.3514 18.0011 10.181 18.001 8.99899C18.0009 6.61191 17.0525 4.32265 15.3645 2.63482C13.6765 0.946997 11.3871 -0.00113967 9 -0.00100707C6.61292 -0.000874458 4.32366 0.947518 2.63583 2.63553C0.948006 4.32355 -0.000132482 6.61291 1.38846e-08 8.99999Z"
        fill="url(#paint0_radial_3_239)"
      />
      <path
        d="M3 8.99999C3 12.31 5.69 15 9 15C12.31 15 15 12.31 15 8.99999C15 5.68999 12.31 2.99999 9 2.99999C5.69 2.99999 3 5.68999 3 8.99999Z"
        fill={color}
      />
      <defs>
        <radialGradient
          id="paint0_radial_3_239"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(9 8.99999) scale(9 9)"
        >
          <stop />
          <stop stopColor={color} offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
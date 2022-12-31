import React from 'react';

export function Carret({direction}: {direction: 'down' | 'right'}) {
  let className = 'h-[8px] inline w-[7px] mr-[3px]';

  if (direction === 'down') {
    className += ' rotate-90';
  }

  return (
    <svg
      className={className}
      width="50"
      height="71"
      viewBox="0 0 50 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 35.5L0.499997 70.574L0.5 0.425974L50 35.5Z" fill="#9BA0A5" />
    </svg>
  );
}

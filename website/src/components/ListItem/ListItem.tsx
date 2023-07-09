import React from 'react';

export interface Props {
  children: React.ReactNode;
  index?: number;
}

export function ListItem({children, index}: Props) {
  return (
    <li className="flex gap-4">
      {index && (
        <div className="flex shrink-0 items-center justify-center w-[30px] h-[30px] text-accent font-semibold text-3xl">
          {index}
        </div>
      )}
      <div>{children}</div>
    </li>
  );
}

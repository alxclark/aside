import React from 'react';

export interface Props {
  children: React.ReactNode;
  index?: number;
}

export function ListItem({children, index}: Props) {
  return (
    <li className="flex gap-4">
      {index && (
        <div className="flex shrink-0 items-start justify-center text-accent font-semibold">
          {index}
        </div>
      )}
      <div>{children}</div>
    </li>
  );
}

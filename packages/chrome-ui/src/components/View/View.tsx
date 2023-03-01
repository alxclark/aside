import classNames from 'classnames';
import React from 'react';

export interface Props {
  children: React.ReactNode;
  flexGrow?: boolean;
  width?: number;
  border?: 'left';
  fullHeight?: boolean;
}

export function View({children, flexGrow, width, border, fullHeight}: Props) {
  return (
    <div
      style={{width}}
      className={classNames(
        flexGrow && 'grow',
        border && 'border-gray-400',
        border === 'left' && 'border-l',
        fullHeight && 'h-full',
      )}
    >
      {children}
    </div>
  );
}

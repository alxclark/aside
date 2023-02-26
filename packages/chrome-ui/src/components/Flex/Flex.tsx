import classNames from 'classnames';
import React from 'react';

export interface Props {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  fullHeight?: boolean;
}

export function Flex({children, direction, fullHeight}: Props) {
  return (
    <div
      className={classNames(
        'flex',
        direction === 'row' && 'flex-row',
        direction === 'column' && 'flex-col',
        fullHeight && 'h-full',
      )}
    >
      {children}
    </div>
  );
}

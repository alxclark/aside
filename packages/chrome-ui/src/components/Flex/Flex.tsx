import classNames from 'classnames';
import React from 'react';

export interface Props {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  fullHeight?: boolean;
  gap?: string;
  alignItems?: 'center';
}

export function Flex({
  children,
  direction,
  fullHeight,
  gap,
  alignItems,
}: Props) {
  return (
    <div
      style={{gap}}
      className={classNames(
        'flex',
        direction === 'row' && 'flex-row',
        direction === 'column' && 'flex-col',
        fullHeight && 'h-full',
        alignItems === 'center' && 'items-center',
      )}
    >
      {children}
    </div>
  );
}

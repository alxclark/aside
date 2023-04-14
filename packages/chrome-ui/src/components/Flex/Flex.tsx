import classNames from 'classnames';
import React from 'react';

export interface Props {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  fullHeight?: boolean;
  gap?: string;
  alignItems?: 'center' | 'start';
  justifyContent?: 'space-between' | 'center';
  wrap?: boolean;
}

export function Flex({
  children,
  direction,
  fullHeight,
  gap,
  alignItems,
  justifyContent,
  wrap,
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
        alignItems === 'start' && 'items-start',
        justifyContent === 'space-between' && 'justify-between',
        justifyContent === 'center' && 'justify-center',
        wrap && 'flex-wrap',
      )}
    >
      {children}
    </div>
  );
}

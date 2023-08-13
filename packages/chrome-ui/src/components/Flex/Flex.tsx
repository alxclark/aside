import React from 'react';
import classNames from 'classnames';
import {FlexProps} from '@aside/chrome-ui-remote';

export type {FlexProps};

export function Flex({
  children,
  direction,
  fullHeight,
  gap,
  alignItems,
  justifyContent,
  wrap,
}: FlexProps) {
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

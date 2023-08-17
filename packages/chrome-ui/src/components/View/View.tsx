import React from 'react';
import {ViewProps} from '@aside/chrome-ui-remote';
import classNames from 'classnames';

export type {ViewProps};

export function View({
  children,
  flexGrow,
  width,
  border,
  fullHeight,
  margin,
  padding,
  maxHeight,
  overflow,
  maxWidth,
  minWidth,
  overflowWrap,
  position,
}: ViewProps) {
  return (
    <div
      style={{
        width,
        margin,
        padding,
        maxHeight,
        overflow,
        maxWidth,
        minWidth,
        overflowWrap,
        position,
      }}
      className={classNames(
        flexGrow && 'grow',
        border && 'border-border',
        border === 'left' && 'border-l',
        fullHeight && 'h-full',
      )}
    >
      {children}
    </div>
  );
}

import classNames from 'classnames';
import React, {CSSProperties} from 'react';

export interface Props {
  children: React.ReactNode;
  flexGrow?: boolean;
  width?: number;
  border?: 'left';
  fullHeight?: boolean;
  margin?: CSSProperties['margin'];
  padding?: CSSProperties['padding'];
  maxHeight?: CSSProperties['maxHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  minWidth?: CSSProperties['minWidth'];
  overflow?: CSSProperties['overflow'];
}

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
}: Props) {
  return (
    <div
      style={{width, margin, padding, maxHeight, overflow, maxWidth, minWidth}}
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

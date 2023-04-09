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
}

export function View({
  children,
  flexGrow,
  width,
  border,
  fullHeight,
  margin,
  padding,
}: Props) {
  return (
    <div
      style={{width, margin, padding}}
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

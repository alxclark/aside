import classNames from 'classnames';
import React, {CSSProperties} from 'react';

export interface Props {
  children: React.ReactNode;
  flexGrow?: boolean;
  width?: number;
  border?: 'left';
  fullHeight?: boolean;
  margin?: CSSProperties['margin'];
}

export function View({
  children,
  flexGrow,
  width,
  border,
  fullHeight,
  margin,
}: Props) {
  return (
    <div
      style={{width, margin}}
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

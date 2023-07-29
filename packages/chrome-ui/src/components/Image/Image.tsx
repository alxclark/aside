/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import classNames from 'classnames';

export interface Props {
  source: string;
  height?: number;
  width?: number;
  filter?: 'grayscale' | 'none';
}

export function Image({source, height, filter, width}: Props) {
  return (
    <img
      src={source}
      style={{height, width}}
      className={classNames(
        filter === 'grayscale' ? 'grayscale' : 'grayscale-0',
      )}
    />
  );
}

/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import classNames from 'classnames';
import {ImageProps} from '@aside/chrome-ui-remote';

export type {ImageProps};

export function Image({source, height, filter, width}: ImageProps) {
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

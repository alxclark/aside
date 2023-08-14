import React from 'react';
import {DividerProps} from '@aside/chrome-ui-remote';

export type {DividerProps};

export function Divider({horizontal}: DividerProps) {
  if (horizontal) {
    return <div className="h-[1px] bg-hairline w-full my-[4px]" />;
  }

  return <div className="w-[1px] bg-hairline mx-[5px] my-[4px] h-[16px]" />;
}

import React from 'react';

export interface Props {
  horizontal?: boolean;
}

export function Divider({horizontal}: Props) {
  if (horizontal) {
    return <div className="h-[1px] bg-hairline w-full my-[4px]" />;
  }

  return <div className="w-[1px] bg-hairline mx-[5px] my-[4px] h-[16px]" />;
}

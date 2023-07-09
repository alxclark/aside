'use client';

import React from 'react';

export interface Props {
  children: React.ReactNode;
  onPress: () => void;
}

export function Button({children, onPress}: Props) {
  return (
    <button
      onClick={onPress}
      className="flex font-semibold items-center gap-2 font-medium text-sm bg-accent text-dark-surface px-5 py-2 b rounded-full"
    >
      {children}
    </button>
  );
}

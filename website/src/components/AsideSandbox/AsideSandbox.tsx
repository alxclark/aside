'use client';

import {AllComponents} from '@aside/chrome-ui/react';
import {themes} from 'prism-react-renderer';
import React, {PropsWithChildren, useState} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';

export interface Props {
  code: string;
}

export function AsideSandbox({code}: Props) {
  return (
    <LiveProvider
      theme={themes.oceanicNext}
      code={code}
      scope={{
        useState,
        Aside: ({children}: PropsWithChildren) => <div>{children}</div>,
        DevTools: ({children}: PropsWithChildren) => (
          <div className="aside">{children}</div>
        ),
        ...AllComponents,
      }}
      enableTypeScript
    >
      <LiveEditor className="child:text-sm child:p-3 child:dark:!bg-dark-surface2 child:rounded-md !font-mono" />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
}

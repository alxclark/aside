'use client';

import {AllComponents} from '@aside/chrome-ui';
import {themes} from 'prism-react-renderer';
import React, {PropsWithChildren, useState} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';

export interface Props {
  code: string;
  scope?: {[key: string]: unknown} | undefined;
  height?: number;
  display?: 'all' | 'code' | 'code-extension';
}

export function AsideSandbox({code, scope, height, display = 'all'}: Props) {
  const showExtensionPreview =
    display === 'all' || display === 'code-extension';
  const showWebpagePreview = display === 'all';

  return (
    <LiveProvider
      enableTypeScript
      theme={themes.vsDark}
      code={code}
      scope={{
        useState,
        Aside: ({children}: PropsWithChildren) => (
          <>
            {showWebpagePreview && (
              <>
                <div className="absolute md:left-[calc(100%+1px)] box-content top-full md:top-[-1px] w-full h-full border border-[#484c50]">
                  {children}
                </div>
                <div className="text-xs rounded-full bg-dark-surface3 absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] px-2 py-0.5 text-accent font-semibold">
                  Webpage
                </div>
              </>
            )}
          </>
        ),
        Devtools: ({children}: PropsWithChildren) => (
          <>
            <div className="z-10 text-xs rounded-full bg-dark-surface3 absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] px-2 py-0.5 text-accent font-semibold">
              Extension
            </div>
            <div className="aside relative h-full">{children}</div>
          </>
        ),
        ...AllComponents,
        ...scope,
      }}
    >
      <LiveEditor className="child:text-sm child:p-3 child:dark:!bg-dark-surface2 child:rounded-t-lg !font-mono child:border-2 child:border-transparent child:hover:border-accent" />
      <LiveError />
      {showExtensionPreview && (
        <LivePreview
          className="flex child:w-full md:child:w-6/12 child:flex child:items-center child:justify-center child:relative child:dark:border-dark-border child:border"
          style={{height}}
        />
      )}
    </LiveProvider>
  );
}

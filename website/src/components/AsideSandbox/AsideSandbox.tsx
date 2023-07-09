'use client';

import {
  AllComponents,
  PaneToolbar,
  Flex,
  Tabs,
  Tab,
} from '@aside/chrome-ui/react';
import {themes} from 'prism-react-renderer';
import React, {PropsWithChildren, useState} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';

export interface Props {
  code: string;
  scope?: {[key: string]: unknown} | undefined;
  height?: number;
}

export function AsideSandbox({code, scope, height}: Props) {
  return (
    <LiveProvider
      enableTypeScript
      theme={themes.vsDark}
      code={code}
      scope={{
        useState,
        Aside: ({children}: PropsWithChildren) => (
          <>
            <div className="absolute left-[calc(100%+1px)] box-content top-[-1px] w-full h-full border border-[#484c50]">
              {children}
            </div>
            <div className="text-xs rounded-full bg-dark-surface3 absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] px-2 py-0.5 text-accent font-semibold">
              Webpage
            </div>
          </>
        ),
        DevTools: ({children}: PropsWithChildren) => (
          <>
            <div className="z-10 text-xs rounded-full bg-dark-surface3 absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-50%] px-2 py-0.5 text-accent font-semibold">
              Extension
            </div>
            <div className="aside relative h-full">
              <PaneToolbar>
                <Flex justifyContent="space-between">
                  <Flex alignItems="center">
                    <Tabs selected="aside" setSelected={() => {}}>
                      <Tab id="aside" label="Aside" />
                    </Tabs>
                  </Flex>
                </Flex>
              </PaneToolbar>
              {children}
            </div>
          </>
        ),
        ...AllComponents,
        ...scope,
      }}
    >
      <LiveEditor className="child:text-sm child:p-3 child:dark:!bg-dark-surface2 child:rounded-t-lg !font-mono child:border-2 child:border-transparent child:hover:border-accent" />
      <LiveError />
      <LivePreview
        className="flex child:w-6/12 child:flex child:items-center child:justify-center child:relative child:dark:border-dark-border child:border"
        style={{height}}
      />
    </LiveProvider>
  );
}

import {AllComponents} from '@aside/chrome-ui';
import {themes} from 'prism-react-renderer';
import React, {
  type PropsWithChildren,
  useState,
  useRef,
  useEffect,
} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';
import {createRoot} from 'react-dom/client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sheet from '@aside/chrome-ui/css' assert {type: 'css'};

export interface Props {
  code: string;
  scope?: {[key: string]: unknown} | undefined;
  height?: number;
  display?: 'all' | 'code' | 'code-extension';
}

export function AsideLive(props: Props) {
  const divRef = useRef<HTMLDivElement>();
  const shadowRef = useRef<ShadowRoot>();
  const elementForShadowRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!shadowRef.current) {
      const elementForShadow = document.createElement('div');
      const shadow = divRef.current.attachShadow({mode: 'open'});

      shadow.appendChild(elementForShadow);
      shadow.adoptedStyleSheets = [sheet];

      shadowRef.current = shadow;
      elementForShadowRef.current = elementForShadow;
    }

    const root = createRoot(elementForShadowRef.current);
    root.render(<AsideLiveInner {...props} />);

    return () => {
      root.unmount();
    };
  }, [props]);

  return <div ref={divRef} />;
}

export function AsideLiveInner({code, scope, height, display = 'all'}: Props) {
  const showExtensionPreview =
    display === 'all' || display === 'code-extension';
  const showWebpagePreview = display === 'all';

  return (
    <LiveProvider
      enableTypeScript
      theme={themes.dracula}
      code={code}
      scope={{
        React,
        ...React,
        Aside: ({children}: PropsWithChildren) => (
          <>
            {showWebpagePreview && (
              <>
                <div>{children}</div>
                <div>Webpage</div>
              </>
            )}
          </>
        ),
        Devtools: ({children}: PropsWithChildren) => (
          <>
            <div>Extension</div>
            <div style={{height: 100}} className="aside bg-background">
              {children}
            </div>
          </>
        ),
        ...AllComponents,
        ...scope,
      }}
    >
      <LiveEditor />
      <LiveError />
      {showExtensionPreview && <LivePreview style={{height}} />}
    </LiveProvider>
  );
}

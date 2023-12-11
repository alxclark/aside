import {
  AllComponents,
  PaneToolbar,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@aside/chrome-ui';
import {themes} from 'prism-react-renderer';
import React, {type PropsWithChildren, useRef, useEffect} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';
import {createRoot} from 'react-dom/client';
import sheet from '@aside/chrome-ui/css' assert {type: 'css'};

import styles from './styles.module.css';

export interface Props {
  code: string;
  scope?: {[key: string]: unknown} | undefined;
  height?: number;
}

export function Shadow(props: PropsWithChildren) {
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
    root.render(props.children);

    return () => {
      root.unmount();
    };
  }, [props]);

  return <div ref={divRef} />;
}

export function AsideLive({code, scope, height}: Props) {
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
            <div className={styles.container}>{children}</div>
          </>
        ),
        Devtools: ({children}: PropsWithChildren) => (
          <Shadow>
            <div
              style={{
                minHeight: 100,
                fontSize: 12,
                fontFamily: 'Helvetica Neue',
              }}
              className="aside bg-background"
            >
              <Tabs defaultValue="aside">
                <PaneToolbar>
                  <TabsList>
                    <TabsTrigger value="aside">Aside</TabsTrigger>
                  </TabsList>
                </PaneToolbar>
              </Tabs>
              {children}
            </div>
          </Shadow>
        ),
        ...AllComponents,
        ...scope,
      }}
    >
      <LiveError />
      <LivePreview style={{height}} />
      <code className={styles.code}>
        <LiveEditor tabMode="focus" className={styles.editor} />
      </code>
    </LiveProvider>
  );
}

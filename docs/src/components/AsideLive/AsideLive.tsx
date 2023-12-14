import {
  AllComponents,
  PaneToolbar,
  Tabs,
  TabsList,
  TabsTrigger,
  View,
} from '@aside/chrome-ui';
import {themes} from 'prism-react-renderer';
import React, {type PropsWithChildren, useRef, useEffect} from 'react';
import {LiveEditor, LiveError, LivePreview, LiveProvider} from 'react-live';
import {Root, createRoot} from 'react-dom/client';
import sheet from '@aside/chrome-ui/css' assert {type: 'css'};
import {useColorMode} from '@docusaurus/theme-common';

import styles from './styles.module.css';

export interface Props {
  code: string;
  scope?: {[key: string]: unknown} | undefined;
  height?: number;
  showFrame?: boolean;
  centered?: boolean;
}

export function Shadow(props: PropsWithChildren) {
  const divRef = useRef<HTMLDivElement>();
  const shadowRef = useRef<ShadowRoot>();
  const elementForShadowRef = useRef<HTMLDivElement>();
  const rootRef = useRef<Root>();

  useEffect(() => {
    if (!rootRef.current) {
      const elementForShadow = document.createElement('div');
      const shadow = divRef.current.attachShadow({mode: 'open'});

      shadow.appendChild(elementForShadow);
      shadow.adoptedStyleSheets = [sheet];

      shadowRef.current = shadow;
      elementForShadowRef.current = elementForShadow;
      const root = createRoot(elementForShadowRef.current);

      rootRef.current = root;
    }

    rootRef.current.render(props.children);
  }, [props]);

  return <div ref={divRef} />;
}

export function AsideLive({code, scope, height, ...rest}: Props) {
  const {isDarkTheme} = useColorMode();

  return (
    <LiveProvider
      enableTypeScript
      theme={isDarkTheme ? themes.vsDark : themes.github}
      code={code}
      scope={{
        React,
        ...React,
        Aside,
        Devtools: ({children}: PropsWithChildren) => (
          <Devtools centered>{children}</Devtools>
        ),
        ...AllComponents,
        ...scope,
      }}
    >
      <LiveError />
      <LivePreview
        Component={({children}) => (
          <Aside>
            <Devtools {...rest}>{children}</Devtools>
          </Aside>
        )}
        style={{height}}
      />
      <code className={styles.code}>
        <LiveEditor tabMode="focus" className={styles.editor} />
      </code>
    </LiveProvider>
  );
}

function Aside({children}: PropsWithChildren<{}>) {
  return <div className={styles.container}>{children}</div>;
}

function Devtools({
  children,
  centered,
  showFrame,
}: PropsWithChildren<Pick<Props, 'centered' | 'showFrame'>>) {
  return (
    <Shadow>
      <div
        style={{
          minHeight: 100,
          fontSize: 12,
          fontFamily: 'Helvetica Neue',
          zoom: 1.25,
          display: centered ? 'flex' : 'block',
        }}
        className="aside bg-background"
      >
        {showFrame && (
          <Tabs defaultValue="aside">
            <PaneToolbar>
              <TabsList>
                <TabsTrigger value="aside">Aside</TabsTrigger>
              </TabsList>
            </PaneToolbar>
          </Tabs>
        )}
        {centered && (
          <View className="flex justify-center items-center grow">
            {children}
          </View>
        )}
        {!centered && children}
      </div>
    </Shadow>
  );
}

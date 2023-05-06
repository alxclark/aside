import React, {useState} from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../Renderer';
import {isCollapsible} from '../utilities';

import {KeyRenderer} from './KeyRenderer';

export function KeyValueRenderer({value, path}: {value: any; path: string[]}) {
  const [collapsed, setCollapsed] = useState(true);
  const collapsible = isCollapsible(value);

  return (
    <>
      <button onClick={() => setCollapsed((prev) => !prev)}>
        <KeyRenderer
          collapsed={collapsed}
          collapsible={collapsible}
          path={path}
        />
        <Renderer collapsed={collapsed} value={value} path={path} preview />
      </button>
      {collapsible && !collapsed && (
        <Renderer collapsed={false} value={value} path={path} />
      )}
    </>
  );
}

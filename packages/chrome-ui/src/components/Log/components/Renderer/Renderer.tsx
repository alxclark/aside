import React from 'react';

import {NumberRenderer} from './NumberRenderer';
// eslint-disable-next-line import/no-cycle
import {ObjectRenderer} from './ObjectRenderer';
import {StringRenderer} from './StringRenderer';

export function Renderer({
  value,
  collapsed,
  nested,
  path = [],
}: {
  value: any;
  collapsed?: boolean;
  nested?: boolean;
  path?: string[];
}) {
  switch (typeof value) {
    case 'string':
      return <StringRenderer value={value} path={path} collapsed={collapsed} />;
    case 'number':
      return <NumberRenderer value={value} path={path} collapsed={collapsed} />;
    case 'object':
      return (
        <ObjectRenderer
          value={value}
          collapsed={collapsed}
          nested={nested}
          path={path}
        />
      );
    default:
      return <></>;
  }
}

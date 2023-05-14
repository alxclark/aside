import React from 'react';

// eslint-disable-next-line import/no-cycle
import {
  BooleanRenderer,
  DefaultRenderer,
  NumberRenderer,
  ObjectRenderer,
  StringRenderer,
} from './components';

export function Renderer({
  value,
  preview,
  path = [],
  depth = 0,
  previous,
}: {
  value: any;
  preview?: boolean;
  path?: string[];
  depth?: number;
  previous?: any;
}) {
  switch (typeof value) {
    case 'string':
      return <StringRenderer value={value} />;
    case 'number':
      return <NumberRenderer value={value} />;
    case 'boolean':
      return <BooleanRenderer value={value} />;
    case 'undefined':
      return <DefaultRenderer value="undefined" />;
    case 'object':
      return (
        <ObjectRenderer
          depth={depth}
          value={value}
          preview={preview}
          path={path}
          previous={previous}
        />
      );
    default:
      return <></>;
  }
}

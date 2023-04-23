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
  nested,
  path = [],
  showDiffs = false,
}: {
  value: any;
  preview?: boolean;
  nested?: boolean;
  path?: string[];
  showDiffs?: boolean;
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
          value={value}
          preview={preview}
          nested={nested}
          path={path}
          showDiffs={showDiffs}
        />
      );
    default:
      return <></>;
  }
}

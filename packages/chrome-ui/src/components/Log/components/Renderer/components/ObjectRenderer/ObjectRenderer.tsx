import React from 'react';

import {isDiff} from '../../../../utilities';
import {DefaultRenderer} from '../DefaultRenderer';

// eslint-disable-next-line import/no-cycle
import {DiffRenderer, ArrayRenderer, RecordRenderer} from './components';

export function ObjectRenderer(props: {
  value: {[key: string]: any} | null;
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const {value, preview, path, depth} = props;

  if (value === null) {
    return <DefaultRenderer value="null" />;
  }

  if (Array.isArray(value)) {
    return (
      <ArrayRenderer
        value={value}
        preview={preview}
        path={path}
        depth={depth}
      />
    );
  }

  if (isDiff(value)) {
    return (
      <DiffRenderer value={value} preview={preview} path={path} depth={depth} />
    );
  }

  return (
    <RecordRenderer value={value} preview={preview} path={path} depth={depth} />
  );
}

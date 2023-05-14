import React from 'react';

import {isDiff} from '../../../../utilities';
import {DefaultRenderer} from '../DefaultRenderer';

// eslint-disable-next-line import/no-cycle
import {DiffRenderer, ArrayRenderer, RecordRenderer} from './components';

export function ObjectRenderer(props: {
  value: object;
  previous?: object;
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const {value, preview, path, depth, previous} = props;

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
        previous={Array.isArray(previous) ? previous : undefined}
      />
    );
  }

  if (isDiff(value)) {
    return (
      <DiffRenderer value={value} preview={preview} path={path} depth={depth} />
    );
  }

  return (
    <RecordRenderer
      value={value}
      preview={preview}
      path={path}
      depth={depth}
      previous={previous}
    />
  );
}

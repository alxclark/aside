import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {DiffNode} from '../../../../../types';
import {useRenderer} from '../../../../../hooks';

// eslint-disable-next-line import/no-cycle
import {ArrayRenderer} from './ArrayRenderer';

export function DiffRenderer({
  value,
  preview,
  path,
  depth = 0,
}: {
  value: DiffNode;
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const {showDiffs} = useRenderer();

  if (Array.isArray(value.next)) {
    return (
      <ArrayRenderer
        path={path}
        value={value.next}
        preview={preview}
        depth={depth}
      />
    );
  }

  console.log({value});

  return (
    <>
      {showDiffs && depth === 0 && (
        <>
          <Renderer value={value.previous} path={path} preview />
          <span className="text-white">{' → '}</span>
        </>
      )}

      <Renderer
        value={value.next}
        preview={preview}
        path={path}
        depth={depth}
      />
    </>
  );
}

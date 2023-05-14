import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {DiffNode} from '../../../../../types';
import {useRenderer} from '../../../../../hooks';

// eslint-disable-next-line import/no-cycle
import {ObjectRenderer} from '../ObjectRenderer';
import {isCollapsible} from '../../../utilities';

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

  return (
    <>
      {showDiffs && depth === 0 && !isCollapsible(value.next) && (
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
        previous={value.previous}
      />
    </>
  );
}

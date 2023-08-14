import React from 'react';
import type {DiffNode} from '@aside/chrome-ui-remote';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {useRenderer} from '../../../../../hooks';
import {isCollapsible} from '../../../utilities';

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
  const {showPreviousValues} = useRenderer();

  return (
    <>
      {showPreviousValues && depth === 0 && !isCollapsible(value.next) && (
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

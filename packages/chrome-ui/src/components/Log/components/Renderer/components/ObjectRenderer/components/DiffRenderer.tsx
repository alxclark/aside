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
}: {
  value: DiffNode;
  preview?: boolean;
  path: string[];
}) {
  const {showDiffs} = useRenderer();
  const collapsible = Array.isArray(value.next);

  if (Array.isArray(value.next)) {
    return <ArrayRenderer path={path} value={value.next} preview={preview} />;
  }

  return (
    <>
      {showDiffs && !preview && (
        <>
          <Renderer
            value={value.previous}
            path={path}
            collapsible={collapsible}
          />
          <span className="text-white">{' → '}</span>
        </>
      )}

      <Renderer value={value.next} preview={preview} path={path} />
    </>
  );
}

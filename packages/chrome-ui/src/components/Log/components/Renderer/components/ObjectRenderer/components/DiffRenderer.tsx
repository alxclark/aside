import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {DiffNode} from '../../../../../types';

export function DiffRenderer({
  value,
  showDiffs,
  preview,
}: {
  value: DiffNode;
  showDiffs?: boolean;
  preview?: boolean;
}) {
  return (
    <>
      {showDiffs && !preview && (
        <>
          <Renderer value={value.previous} />
          <span className="text-white">{' → '}</span>
        </>
      )}

      <Renderer value={value.next} preview={preview} />
    </>
  );
}

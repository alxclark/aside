import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
// eslint-disable-next-line import/no-cycle
import {ObjectRenderer} from '../ObjectRenderer';

export function ArrayRenderer({
  value,
  showDiffs,
  preview,
  path,
}: {
  value: any[];
  showDiffs?: boolean;
  preview?: boolean;
  path: string[];
}) {
  if (preview) {
    return <span className="text-white">Array({value.length})</span>;
  }

  const key = path[path.length - 1];

  return (
    <ObjectRenderer
      path={[]}
      value={{[key]: {...value}}}
      preview={preview}
      showDiffs={showDiffs}
    />
  );
}

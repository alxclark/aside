import React from 'react';
import classNames from 'classnames';

import {isDiff} from '../../../../utilities';
import {DefaultRenderer} from '../DefaultRenderer';
// eslint-disable-next-line import/no-cycle
import {KeyValueRenderer} from '../KeyValueRenderer';

// eslint-disable-next-line import/no-cycle
import {DiffRenderer, ArrayRenderer} from './components';

export function ObjectRenderer({
  value,
  preview,
  path,
  collapsed: collapsedParent,
}: {
  value: {[key: string]: any} | null;
  preview?: boolean;
  path: string[];
  collapsed?: boolean;
}) {
  if (value === null) {
    return <DefaultRenderer value="null" />;
  }

  if (Array.isArray(value)) {
    return (
      <ArrayRenderer
        collapsed={collapsedParent}
        value={value}
        preview={preview}
        path={path}
      />
    );
  }

  if (isDiff(value)) {
    return <DiffRenderer path={path} value={value} preview={preview} />;
  }

  if (preview) {
    return <span className="text-white">{'{…}'}</span>;
  }

  const keys = Object.keys(value).sort();
  const nested = path.length > 0;

  return (
    <div
      className={classNames(
        'flex flex-col items-start pl-[12px]',
        nested && 'pl-[10px]',
      )}
    >
      {keys.map((key) => (
        <KeyValueRenderer key={key} value={value[key]} path={[...path, key]} />
      ))}
    </div>
  );
}

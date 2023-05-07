/* eslint-disable import/no-cycle */
import React, {useCallback} from 'react';
import classNames from 'classnames';

import {useRenderer} from '../../../../../hooks';
import {Carret} from '../../../../../../Carret';
import {KeyValueRenderer} from '../../KeyValueRenderer';

export function RecordRenderer({
  value,
  preview,
  path,
  depth = 0,
}: {
  value: {[key: string]: any};
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const opened = renderer.opened[key];

  const parentKey = path.slice(0, -1).join('.');
  const parentOpened = renderer.opened[parentKey];

  const handleClick = useCallback(
    () => renderer.setOpened(key, !opened),
    [key, opened, renderer],
  );

  if (preview) {
    if (parentOpened && depth === 0) {
      return <DescriptivePreview depth={depth} value={value} path={path} />;
    }
    return <SimplePreview />;
  }

  const keys = Object.keys(value).sort();
  const nested = path.length > 0;

  return (
    <>
      {!nested && (
        <div className="relative" onClick={handleClick} onKeyDown={handleClick}>
          <div className="absolute left-[-10px] top-[-1px]">
            <Carret direction={opened ? 'down' : 'right'} />
          </div>
          <DescriptivePreview depth={depth} value={value} path={path} />
        </div>
      )}
      {opened && (
        <div
          className={classNames(
            'flex flex-col items-start pl-[12px]',
            nested && 'pl-[10px]',
          )}
        >
          {keys.map((key) => (
            <KeyValueRenderer
              key={key}
              value={value[key]}
              path={[...path, key]}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SimplePreview() {
  return <span className="text-white">{'{…}'}</span>;
}

function DescriptivePreview({
  value,
  path,
  depth,
}: {
  value: {[key: string]: any};
  path: string[];
  depth: number;
}) {
  const keys = Object.keys(value).sort();

  return (
    <span className="italic">
      <span className="text-white">{'{'}</span>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <KeyValueRenderer
            preview
            depth={depth + 1}
            value={value[key]}
            path={[...path, key]}
          />
          {index !== keys.length - 1 && <span className="text-white">, </span>}
        </React.Fragment>
      ))}
      <span className="text-white">{'}'}</span>
    </span>
  );
}

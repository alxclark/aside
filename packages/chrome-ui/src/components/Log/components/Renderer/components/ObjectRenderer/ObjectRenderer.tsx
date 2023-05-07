import React, {useCallback} from 'react';
import classNames from 'classnames';

import {isDiff} from '../../../../utilities';
import {DefaultRenderer} from '../DefaultRenderer';
// eslint-disable-next-line import/no-cycle
import {KeyValueRenderer} from '../KeyValueRenderer';
import {useRenderer} from '../../../../hooks';
import {Carret} from '../../../../../Carret';

import {DiffRenderer, ArrayRenderer} from './components';

export function ObjectRenderer({
  value,
  preview,
  path,
}: {
  value: {[key: string]: any} | null;
  preview?: boolean;
  path: string[];
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const opened = renderer.opened[key];

  const parentKey = path.slice(0, -1).join('.');
  const parentOpened = renderer.opened[parentKey];

  console.log({path, parentKey, parentOpened, renderer});

  const handleClick = useCallback(
    () => renderer.setOpened(key, !opened),
    [key, opened, renderer],
  );

  if (value === null) {
    return <DefaultRenderer value="null" />;
  }

  if (Array.isArray(value)) {
    return <ArrayRenderer value={value} preview={preview} path={path} />;
  }

  if (isDiff(value)) {
    return <DiffRenderer path={path} value={value} preview={preview} />;
  }

  if (preview && !opened) {
    if (parentOpened) {
      return <DescriptivePreview value={value} path={path} />;
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
          <DescriptivePreview value={value} path={path} />
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
}: {
  value: {[key: string]: any};
  path: string[];
}) {
  const keys = Object.keys(value).sort();

  return (
    <span className="italic">
      <span className="text-white">{'{'}</span>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <KeyValueRenderer preview value={value[key]} path={[...path, key]} />
          {index !== keys.length - 1 && <span className="text-white">, </span>}
        </React.Fragment>
      ))}
      <span className="text-white">{'}'}</span>
    </span>
  );
}

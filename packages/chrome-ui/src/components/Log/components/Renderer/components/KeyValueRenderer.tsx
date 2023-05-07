import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../Renderer';
import {isCollapsible} from '../utilities';
import {useRenderer} from '../../../hooks';

import {KeyRenderer} from './KeyRenderer';

export function KeyValueRenderer({
  value,
  path,
  preview,
}: {
  value: any;
  path: string[];
  preview?: boolean;
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const open = renderer.opened[key];

  const collapsible = isCollapsible(value);
  const handleClick = () => {
    if (preview) return;
    renderer.setOpened(key, !open);
  };

  return (
    <>
      <button onClick={handleClick}>
        <KeyRenderer collapsible={collapsible} path={path} preview={preview} />
        <Renderer value={value} path={path} preview />
      </button>
      {collapsible && open && !preview && (
        <Renderer value={value} path={path} />
      )}
    </>
  );
}

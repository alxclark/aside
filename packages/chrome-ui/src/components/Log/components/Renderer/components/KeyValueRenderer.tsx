import React from 'react';
import classNames from 'classnames';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../Renderer';
import {isCollapsible} from '../utilities';
import {useRenderer} from '../../../hooks';

import {KeyRenderer} from './KeyRenderer';

export function KeyValueRenderer({
  value,
  previous,
  path,
  preview,
  depth,
  linethrough,
  muted,
}: {
  value: any;
  previous?: any;
  path: string[];
  preview?: boolean;
  depth?: number;
  linethrough?: boolean;
  muted?: boolean;
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const open = renderer.opened[key];

  const collapsible = isCollapsible(value);
  const handleClick = () => {
    if (preview || !collapsible) return;
    renderer.setOpened(key, !open);
  };

  return (
    <>
      <span
        onClick={handleClick}
        onKeyDown={handleClick}
        className={classNames(
          linethrough && 'line-through',
          muted && 'opacity-60',
        )}
      >
        <KeyRenderer collapsible={collapsible} path={path} preview={preview} />
        {previous !== undefined && value !== previous && (
          <>
            <Renderer depth={depth} value={previous} path={path} preview />
            <span className="text-white">{' → '}</span>
          </>
        )}
        <Renderer depth={depth} value={value} path={path} preview />
      </span>
      {collapsible && open && !preview && (
        <>
          <Renderer value={value} path={path} />
        </>
      )}
    </>
  );
}

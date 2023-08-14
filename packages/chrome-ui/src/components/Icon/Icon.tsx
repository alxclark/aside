import React from 'react';
import classNames from 'classnames';
import {IconProps} from '@aside/chrome-ui-remote';

import {
  Start,
  Filter,
  Cancel,
  Cog,
  VerticalEllipsis,
  Close,
  RecordOn,
  RecordOff,
  Search,
  Checkmark,
} from './icons';
import {PowerOff} from './icons/PowerOff';

export type {IconProps};

export function Icon({
  source,
  height,
  width,
  color = 'icon-default',
}: IconProps) {
  return (
    <div
      style={{height, width}}
      className={classNames(
        color === 'icon-error' && 'text-icon-error',
        color === 'icon-default' && 'text-icon-default',
        color === 'icon-toggled' && 'text-icon-toggled',
        color === 'icon-subdued' && 'text-icon-subdued',
      )}
    >
      <IconSvg source={source} />
    </div>
  );
}

function IconSvg({source}: Pick<IconProps, 'source'>) {
  switch (source) {
    case 'start':
      return <Start />;
    case 'filter':
      return <Filter />;
    case 'cancel':
      return <Cancel />;
    case 'cog':
      return <Cog />;
    case 'vertical-ellipsis':
      return <VerticalEllipsis />;
    case 'close':
      return <Close />;
    case 'record-on':
      return <RecordOn />;
    case 'record-off':
      return <RecordOff />;
    case 'search':
      return <Search />;
    case 'power-off':
      return <PowerOff />;
    case 'checkmark':
      return <Checkmark />;
    default:
      return null;
  }
}

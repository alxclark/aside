import React from 'react';
import classNames from 'classnames';

import {Color} from '../../types';

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

export interface Props {
  source: IconSource;
  color?: Color;
  height?: number;
  width?: number;
}

export type IconSource =
  | 'start'
  | 'curly'
  | 'filter'
  | 'cancel'
  | 'cog'
  | 'vertical-ellipsis'
  | 'close'
  | 'record-on'
  | 'record-off'
  | 'search'
  | 'power-off'
  | 'checkmark';

export function Icon({source, height, width, color = 'icon-default'}: Props) {
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

function IconSvg({source}: Pick<Props, 'source'>) {
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

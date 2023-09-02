import React from 'react';
import {IconProps} from '@aside/chrome-ui-remote';
import {cva} from 'class-variance-authority';

import {VariantsFromProps} from '../../utilities/style';

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
  FilterFilled,
  CogFilled,
} from './icons';
import {PowerOff} from './icons/PowerOff';
import {FileScript} from './icons/FileScript';

export type {IconProps};

type Variants = VariantsFromProps<IconProps, 'variant' | 'size'>;

const iconVariants = cva<Variants>('', {
  variants: {
    variant: {
      default: 'text-icon-default hover:text-accent-foreground',
      error: 'text-icon-error',
      toggled: 'text-icon-toggled',
      subdued: 'text-icon-subdued',
      yellow: 'text-icon-yellow',
    },
    size: {
      default: 'w-[16px] h-[16px]',
      md: 'w-[11px] h-[11px]',
      sm: 'w-2.5 h-2.5',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export function Icon({source, variant, size, className}: IconProps) {
  return (
    <div className={iconVariants({variant, size, className})}>
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
    case 'filter-filled':
      return <FilterFilled />;
    case 'cancel':
      return <Cancel />;
    case 'cog':
      return <Cog />;
    case 'cog-filled':
      return <CogFilled />;
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
    case 'file-script':
      return <FileScript />;
    default:
      return null;
  }
}

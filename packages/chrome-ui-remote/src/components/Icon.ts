import {createRemoteReactComponent} from '@remote-ui/react';

export interface IconProps {
  /**
   * The identifier for the icon to display.
   */
  source: IconSource;
  variant?: 'default' | 'error' | 'toggled' | 'subdued';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export type Color =
  | 'icon-default'
  | 'icon-error'
  | 'icon-toggled'
  | 'icon-subdued';

export type IconSource =
  | 'start'
  | 'filter'
  | 'filter-filled'
  | 'cancel'
  | 'cog'
  | 'cog-filled'
  | 'vertical-ellipsis'
  | 'close'
  | 'record-on'
  | 'record-off'
  | 'search'
  | 'power-off'
  | 'checkmark';

export const Icon = createRemoteReactComponent<'ChromeUIIcon', IconProps>(
  'ChromeUIIcon',
);

import {createRemoteReactComponent} from '@remote-ui/react';

export interface IconProps {
  /**
   * The identifier for the icon to display.
   */
  source: IconSource;
  /**
   * The color of the icon.
   */
  color?: Color;
  height?: number;
  width?: number;
}

export type Color =
  | 'icon-default'
  | 'icon-error'
  | 'icon-toggled'
  | 'icon-subdued';

export type IconSource =
  | 'start'
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

export const Icon = createRemoteReactComponent<'ChromeUIIcon', IconProps>(
  'ChromeUIIcon',
);

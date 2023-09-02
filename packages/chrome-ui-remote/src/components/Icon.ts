import {createRemoteReactComponent} from '@remote-ui/react';

export interface IconProps {
  /**
   * The identifier for the icon to display.
   */
  source: IconSource;
  variant?: 'default' | 'error' | 'toggled' | 'subdued' | 'yellow';
  size?: 'default' | 'sm' | 'lg' | 'md';
  className?: string;
}

export type Color =
  | 'icon-default'
  | 'icon-error'
  | 'icon-toggled'
  | 'icon-subdued'
  | 'yellow';

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
  | 'checkmark'
  | 'file-script';

export const Icon = createRemoteReactComponent<'ChromeUIIcon', IconProps>(
  'ChromeUIIcon',
);

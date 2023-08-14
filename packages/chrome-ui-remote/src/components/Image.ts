import {createRemoteReactComponent} from '@remote-ui/react';

export interface ImageProps {
  source: string;
  height?: number;
  width?: number;
  filter?: 'grayscale' | 'none';
}

export const Image = createRemoteReactComponent<'ChromeUIImage', ImageProps>(
  'ChromeUIImage',
);

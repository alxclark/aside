import {createRemoteReactComponent} from '@remote-ui/react';
import {CSSProperties} from 'react';

export interface TextProps {
  children: React.ReactNode;
  align?: CSSProperties['textAlign'];
}

export const Text = createRemoteReactComponent<'ChromeUIText', TextProps>(
  'ChromeUIText',
);

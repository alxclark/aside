import {CSSProperties} from 'react';
import {createRemoteReactComponent} from '@remote-ui/react';

export interface ViewProps {
  children: React.ReactNode;
  flexGrow?: boolean;
  width?: number;
  border?: 'left';
  fullHeight?: boolean;
  margin?: CSSProperties['margin'];
  padding?: CSSProperties['padding'];
  maxHeight?: CSSProperties['maxHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  minWidth?: CSSProperties['minWidth'];
  overflow?: CSSProperties['overflow'];
  overflowWrap?: CSSProperties['overflowWrap'];
  position?: CSSProperties['position'];
}

export const View = createRemoteReactComponent<'ChromeUIView', ViewProps>(
  'ChromeUIView',
);

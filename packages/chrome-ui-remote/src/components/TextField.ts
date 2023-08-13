import {createRemoteReactComponent} from '@remote-ui/react';

export interface TextFieldProps {
  id: string;
  placeholder?: string;
  onChange?(value: string): void;
  value?: string;
}

export const TextField = createRemoteReactComponent<
  'ChromeUITextField',
  TextFieldProps
>('ChromeUITextField');

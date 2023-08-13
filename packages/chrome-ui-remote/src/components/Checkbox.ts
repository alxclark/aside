import {createRemoteReactComponent} from '@remote-ui/react';

export interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange(): void;
}

export const Checkbox = createRemoteReactComponent<
  'ChromeUICheckbox',
  CheckboxProps
>('ChromeUICheckbox');

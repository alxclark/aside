import {createRemoteReactComponent} from '@remote-ui/react';
import {PropsWithChildren} from 'react';

export type DropdownProps = PropsWithChildren<{
  dir?: 'ltr' | 'rtl';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
}>;

export const DropdownMenu = createRemoteReactComponent<
  'ChromeUIDropdownMenu',
  DropdownProps
>('ChromeUIDropdownMenu');

export type DropdownMenuTriggerProps = PropsWithChildren<{
  asChild?: boolean;
  className?: string;
}>;

export const DropdownMenuTrigger = createRemoteReactComponent<
  'ChromeUIDropdownMenuTrigger',
  DropdownMenuTriggerProps
>('ChromeUIDropdownMenuTrigger');

export type DropdownMenuGroupProps = PropsWithChildren<{
  asChild?: boolean;
  className?: string;
}>;

export const DropdownMenuGroup = createRemoteReactComponent<
  'ChromeUIDropdownMenuGroup',
  DropdownMenuGroupProps
>('ChromeUIDropdownMenuGroup');

export type DropdownMenuPortalProps = PropsWithChildren<{
  asChild?: boolean;
  className?: string;
}>;

export const DropdownMenuPortal = createRemoteReactComponent<
  'ChromeUIDropdownMenuPortal',
  DropdownMenuPortalProps
>('ChromeUIDropdownMenuPortal');

export type DropdownMenuContentProps = PropsWithChildren<{
  className?: string;
  sideOffset?: number;
}>;

export const DropdownMenuContent = createRemoteReactComponent<
  'ChromeUIDropdownMenuContent',
  DropdownMenuContentProps
>('ChromeUIDropdownMenuContent');

export type DropdownMenuItemProps = PropsWithChildren<{
  inset?: boolean;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  textValue?: string;
  className?: string;
}>;

export const DropdownMenuItem = createRemoteReactComponent<
  'ChromeUIDropdownMenuItem',
  DropdownMenuItemProps
>('ChromeUIDropdownMenuItem');

export type DropdownMenuCheckboxItemProps = PropsWithChildren<{
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}>;

export const DropdownMenuCheckboxItem = createRemoteReactComponent<
  'ChromeUIDropdownMenuCheckboxItem',
  DropdownMenuCheckboxItemProps
>('ChromeUIDropdownMenuCheckboxItem');

export type DropdownMenuLabelProps = PropsWithChildren<{
  inset?: boolean;
  className?: string;
}>;

export const DropdownMenuLabel = createRemoteReactComponent<
  'ChromeUIDropdownMenuLabel',
  DropdownMenuLabelProps
>('ChromeUIDropdownMenuLabel');

export type DropdownMenuSeparatorProps = PropsWithChildren<{
  className?: string;
}>;

export const DropdownMenuSeparator = createRemoteReactComponent<
  'ChromeUIDropdownMenuSeparator',
  DropdownMenuSeparatorProps
>('ChromeUIDropdownMenuSeparator');

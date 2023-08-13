import {createRemoteReactComponent} from '@remote-ui/react';

export interface ConsoleMessageProps {
  /**
   * The value to render using the console renderer.
   *
   * The renderer accepts simple types, and also a special `DiffNode` object.
   */
  value: ConsoleValue;
  /**
   * Whether previous values should be shown when providing a `Diff`.
   */
  showPreviousValues?: boolean;
  /**
   * A dictionary of all the items that have been opened.
   * @example todos[0].content.description
   *
   * When provided for an item, it will open all parent collapsibles on the first render.
   */
  opened?: {[key: string]: boolean};
}

export type ConsoleValue =
  | DiffNode
  | string
  | boolean
  | number
  | any[]
  | null
  | undefined
  | object;

export interface DiffNode {
  __tag: 'diff';
  previous?: ConsoleValue;
  next: ConsoleValue;
}

export const ConsoleMessage = createRemoteReactComponent<
  'ChromeUIConsoleMessage',
  ConsoleMessageProps
>('ChromeUIConsoleMessage');

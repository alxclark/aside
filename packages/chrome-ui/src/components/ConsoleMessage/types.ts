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

export interface Diff {
  [key: string]: DiffNode;
}

export interface RendererContextType {
  showPreviousValues: boolean;
  /**
   * A dictionary of all opened collapsibles
   * example: {'myKey.nested.array.0': true}
   */
  opened: {[key: string]: boolean};
  setOpened(key: string, open: boolean): void;
}

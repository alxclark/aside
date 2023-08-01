export type DiffValue =
  | DiffNode
  | string
  | boolean
  | number
  | any[]
  | null
  | undefined;

export interface DiffNode {
  __tag: 'diff';
  previous?: DiffValue;
  next: DiffValue;
}

export interface Diff {
  [key: string]: DiffNode;
}

export interface RendererContextType {
  showDiffs: boolean;
  /**
   * A dictionary of all opened collapsibles
   * example: {'myKey.nested.array.0': true}
   */
  opened: {[key: string]: boolean};
  setOpened(key: string, open: boolean): void;
}

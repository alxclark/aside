import {DiffNode} from '@aside/chrome-ui-remote';

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

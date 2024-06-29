import '@remote-dom/core/polyfill';

import {
  type RemoteElement,
  type RemoteElementConstructor,
} from '@remote-dom/core/elements';

export {html} from '@remote-dom/core/html';

export * from './elements/elements.ts';

export type AnyElement = Extract<
  keyof HTMLElementTagNameMap,
  `aside-ui-${string}`
>;

export type Elements = Pick<HTMLElementTagNameMap, AnyElement>;

export namespace Elements {
  export type Text = HTMLElementTagNameMap['aside-ui-text'];
  export type TextBlock = HTMLElementTagNameMap['aside-ui-button'];
}

export type ElementConstructors = {
  [Key in keyof Elements]: Elements[Key] extends RemoteElement<
    infer Properties,
    infer Methods,
    infer Slots
  >
    ? RemoteElementConstructor<Properties, Methods, Slots>
    : never;
};

export type CommonElements = Pick<
  Elements,
  'aside-ui-text' | 'aside-ui-button'
>;

import {DOMAttributes, HTMLAttributes} from 'react';

/**
 * Aside's encoder strips out React's SyntheticBaseEvent
 * since remote-ui can't encode the payload.
 */
export type RemoteSafeAttributes<T extends HTMLAttributes<any>> = Omit<
  T,
  keyof DOMAttributes<any>
> &
  RemoteDOMAttributes;

/**
 * Prevent attributes that require serializing a complete event object over RPC.
 * Instead, provide a simple callback to all event handlers.
 *
 * In the future, this can be adapted to provide a sensible payload to each handler.
 */
export type RemoteDOMAttributes = Omit<
  {
    [key in keyof DOMAttributes<HTMLButtonElement>]: NonNullable<
      DOMAttributes<HTMLButtonElement>[key]
    > extends Function
      ? () => void
      : DOMAttributes<HTMLButtonElement>[key];
  },
  'dangerouslySetInnerHTML'
>;

import React, {PropsWithChildren, useEffect} from 'react';
import {RemoteRoot, createReconciler, render} from '@remote-ui/react';

const reconciler = createReconciler({primary: false});

export function RemoteRenderer({
  children,
  root,
  onUnmount,
}: PropsWithChildren<{root: RemoteRoot; onUnmount?: () => void}>) {
  useEffect(() => {
    render(<>{children}</>, root, root.mount, reconciler);
  }, [children, root, onUnmount]);

  useEffect(() => {
    console.log('ran effect');
    return () => {
      // TODO: this should call unmount
      // root.replaceChildren('');
      // render(null, root);
    };
  }, [onUnmount, root]);

  return null;
}

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
    return () => {
      render(null as any, root, root.mount, reconciler);
      onUnmount?.();
    };
  }, [onUnmount, root]);

  return null;
}

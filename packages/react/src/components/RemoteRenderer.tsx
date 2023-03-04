import React, {PropsWithChildren, useMemo, useEffect} from 'react';
import {RemoteRoot, createReconciler, render} from '@remote-ui/react';

export function RemoteRenderer({
  children,
  root,
}: PropsWithChildren<{root: RemoteRoot}>) {
  const reconciler = useMemo(() => createReconciler({primary: false}), []);

  useEffect(() => {
    render(<>{children}</>, root, root.mount, reconciler);
  }, [children, root, reconciler]);

  return null;
}

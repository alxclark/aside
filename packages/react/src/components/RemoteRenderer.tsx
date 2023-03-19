import React, {PropsWithChildren, useMemo, useEffect} from 'react';
import {RemoteRoot, createReconciler, render} from '@remote-ui/react';

const reconciler = createReconciler({primary: false});

export function RemoteRenderer({
  children,
  root,
}: PropsWithChildren<{root: RemoteRoot}>) {
  useEffect(() => {
    render(<>{children}</>, root, root.mount, reconciler);
  }, [children, root]);

  return null;
}

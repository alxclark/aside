import React, {useCallback, useMemo, useState} from 'react';
import {ConsoleMessageProps} from '@aside/chrome-ui-remote';

import {Renderer} from './components';
import {RendererContext} from './context';
import {RendererContextType} from './types';

export type {ConsoleMessageProps};

/**
 * A renderer replicating the look and feel of the `Console` tab.
 */
export function ConsoleMessage({
  value,
  showPreviousValues = false,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  opened: explicitOpened = {'': true},
}: ConsoleMessageProps) {
  const [opened, setOpenedState] = useState(explicitOpened);
  const setOpened: RendererContextType['setOpened'] = useCallback(
    (key, open) => {
      setOpenedState((prev) => ({...prev, [key]: open}));
    },
    [],
  );

  const context = useMemo<RendererContextType>(
    () => ({showPreviousValues, opened, setOpened}),
    [opened, setOpened, showPreviousValues],
  );

  return (
    <RendererContext.Provider value={context}>
      <div className="px-6 py-[2px] font-menlo text-console text-[11px] border-b border-border">
        <Renderer value={value} />
      </div>
    </RendererContext.Provider>
  );
}

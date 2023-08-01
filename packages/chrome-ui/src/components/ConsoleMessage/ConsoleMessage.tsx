import React, {useCallback, useMemo, useState} from 'react';

import {Renderer} from './components';
import {RendererContext} from './context';
import {RendererContextType} from './types';

export interface Props {
  value: any;
  showDiffs?: boolean;
  opened?: {[key: string]: boolean};
}

export function ConsoleMessage({
  value,
  showDiffs = false,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  opened: explicitOpened = {'': true},
}: Props) {
  const [opened, setOpenedState] = useState(explicitOpened);
  const setOpened: RendererContextType['setOpened'] = useCallback(
    (key, open) => {
      setOpenedState((prev) => ({...prev, [key]: open}));
    },
    [],
  );

  const context = useMemo<RendererContextType>(
    () => ({showDiffs, opened, setOpened}),
    [opened, setOpened, showDiffs],
  );

  return (
    <RendererContext.Provider value={context}>
      <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b border-gray-400">
        <Renderer value={value} />
      </div>
    </RendererContext.Provider>
  );
}

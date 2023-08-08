import React, {useCallback, useMemo, useState} from 'react';

import {Renderer} from './components';
import {RendererContext} from './context';
import {ConsoleValue, RendererContextType} from './types';

export interface Props {
  /**
   * The value to render using the console renderer.
   *
   * The renderer accepts simple types, and also a special `DiffNode` object.
   */
  value: ConsoleValue;
  /**
   * Whether previous values should be shown when providing a `Diff`.
   */
  showPreviousValues?: boolean;
  /**
   * A dictionary of all the items that have been opened.
   * @example todos[0].content.description
   *
   * When provided for an item, it will open all parent collapsibles on the first render.
   */
  opened?: {[key: string]: boolean};
}

/**
 * A renderer replicating the look and feel of the `Console` tab.
 */
export function ConsoleMessage({
  value,
  showPreviousValues = false,
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
    () => ({showPreviousValues, opened, setOpened}),
    [opened, setOpened, showPreviousValues],
  );

  return (
    <RendererContext.Provider value={context}>
      <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b border-gray-400">
        <Renderer value={value} />
      </div>
    </RendererContext.Provider>
  );
}

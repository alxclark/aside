import {createContext, useContext, useMemo} from 'react';
import classNames from 'classnames';
import {
  SoftContextMenuProps,
  SoftContextMenuItemProps,
} from '@aside/chrome-ui-remote';

import {Icon} from '../Icon';

export function SoftContextMenu({
  children,
  selected,
  onPress,
}: SoftContextMenuProps) {
  const context = useMemo(() => ({selected, onPress}), [onPress, selected]);

  return (
    <div className="bg-background border border-border absolute top-full z-20 text-inherit min-w-[160px] py-[4px] shadow-lg">
      <SoftContextMenuContext.Provider value={context}>
        {children}
      </SoftContextMenuContext.Provider>
    </div>
  );
}

export function SoftContextMenuItem({children, id}: SoftContextMenuItemProps) {
  const context = useContext(SoftContextMenuContext);

  if (!context)
    throw new Error('SoftContextMenuItem is not wrapped in a SoftContextMenu');

  return (
    <div
      className={classNames(
        !context.selected.includes(id) && 'pl-[26px]',
        'h-[20px] px-2 py-[7px] text-foreground flex items-center hover:bg-softcontext-accent hover:text-accent-foreground font-helvetica flex gap-2',
      )}
      onClick={() => context.onPress(id)}
      onKeyDown={() => context.onPress(id)}
    >
      {context.selected.includes(id) && (
        <Icon source="checkmark" variant="subdued" size="sm" />
      )}
      {children}
    </div>
  );
}

export interface SoftContextMenuContextType {
  selected: string[];
  onPress(id: string): void;
}

const SoftContextMenuContext = createContext<
  SoftContextMenuContextType | undefined
>(undefined);

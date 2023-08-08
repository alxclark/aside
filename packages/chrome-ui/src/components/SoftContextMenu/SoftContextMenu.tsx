import {PropsWithChildren, createContext, useContext, useMemo} from 'react';
import classNames from 'classnames';

import {Icon} from '../Icon';

export interface SoftContextMenuProps extends PropsWithChildren {
  selected: string[];
  onPress(id: string): void;
}

export function SoftContextMenu({
  children,
  selected,
  onPress,
}: SoftContextMenuProps) {
  const context = useMemo(() => ({selected, onPress}), [onPress, selected]);

  return (
    <div className="bg-background border border-hairline absolute top-full z-20 text-inherit min-w-[160px] py-[4px] shadow-lg">
      <SoftContextMenuContext.Provider value={context}>
        {children}
      </SoftContextMenuContext.Provider>
    </div>
  );
}

export interface SoftContextMenuItemProps extends PropsWithChildren {
  id: string;
}

export function SoftContextMenuItem({children, id}: SoftContextMenuItemProps) {
  const context = useContext(SoftContextMenuContext);

  if (!context)
    throw new Error('SoftContextMenuItem is not wrapped in a SoftContextMenu');

  return (
    <div
      className={classNames(
        !context.selected.includes(id) && 'pl-[26px]',
        'h-[20px] px-2 py-[7px] text-gray-200 flex items-center hover:bg-focus hover:text-white font-helvetica flex gap-2',
      )}
      onClick={() => context.onPress(id)}
      onKeyDown={() => context.onPress(id)}
    >
      {context.selected.includes(id) && (
        <Icon source="checkmark" color="icon-subdued" height={10} />
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

import React, {PropsWithChildren} from 'react';

export interface NavigationComponents {}
export type NavigationProps = PropsWithChildren<{}>;

// eslint-disable-next-line func-style
export const Navigation: React.FunctionComponent<NavigationProps> &
  NavigationComponents = function Navigation({children}: NavigationProps) {
  return (
    <nav className="bg-gray-500 w-full min-h-[26px] border-b border-gray-300">
      {children}
    </nav>
  );
};

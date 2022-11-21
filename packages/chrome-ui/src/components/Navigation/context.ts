import {createContext} from 'react';

export interface NavigationContextType {
  /**
   * Update the navigation to the provided tab value
   */
  navigate(value: string): void;
  /**
   * The selected tab value
   */
  selected: string;
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);

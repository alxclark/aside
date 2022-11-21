export interface PrimaryNavigation {
  tab: PrimaryNavigationTab;
}

export enum PrimaryNavigationTab {
  StateTree = 'StateTree',
  StateDiffs = 'StateDiffs',
}

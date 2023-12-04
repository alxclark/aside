import React from 'react';

import {
  Logo,
  SidebarCollapsibleItem,
  SidebarItem,
  SidebarSection,
} from './components';

export interface Props {}

export function Sidebar() {
  return (
    <div className="hidden md:block min-w-[250px] border-r dark:border-dark-border px-10 overflow-auto">
      <Logo />
      <ul className="max-w-[170px]">
        <SidebarSection>
          <SidebarItem
            icon="play"
            label="Getting started"
            url="docs/guides/getting-started"
          />
        </SidebarSection>
        <SidebarSection title="APIs">
          <SidebarItem icon="react" label="React" url="docs/apis/react" />
          <SidebarItem icon="storage" label="Storage" url="docs/apis/storage" />
          <SidebarItem icon="storage" label="Network" url="docs/apis/network" />
        </SidebarSection>
        <SidebarSection title="UI">
          <SidebarCollapsibleItem label="Chrome" icon="chrome">
            <SidebarItem label="Overview" url="docs/ui/chrome" />
            <SidebarItem label="Button" url="docs/ui/chrome/button" />
            <SidebarItem label="Carret" url="docs/ui/chrome/carret" />
            <SidebarItem label="Icon" url="docs/ui/chrome/icon" />
            <SidebarItem
              label="ConsoleMessage"
              url="docs/ui/chrome/console-message"
            />
            <SidebarItem label="Navigation" url="docs/ui/chrome/navigation" />
            <SidebarItem
              label="NavigationTab"
              url="docs/ui/chrome/navigationTab"
            />
            <SidebarItem label="Table" url="docs/ui/chrome/table" />
            <SidebarItem label="TableRow" url="docs/ui/chrome/table-row" />
            <SidebarItem label="View" url="docs/ui/chrome/view" />
            <SidebarItem label="Pane" url="docs/ui/chrome/pane" />
            <SidebarItem
              label="PaneContent"
              url="docs/ui/chrome/pane-content"
            />
            <SidebarItem
              label="PaneToolbar"
              url="docs/ui/chrome/pane-toolbar"
            />
            <SidebarItem
              label="PaneToolbarItem"
              url="docs/ui/chrome/pane-toolbar-item"
            />
            <SidebarItem
              label="PaneToolbarSection"
              url="docs/ui/chrome/pane-toolbar-section"
            />
            <SidebarItem label="Tabs" url="docs/ui/chrome/tabs" />
            <SidebarItem label="Tab" url="docs/ui/chrome/tab" />
            <SidebarItem label="Checkbox" url="docs/ui/chrome/checkbox" />
            <SidebarItem label="Divider" url="docs/ui/chrome/divider" />
            <SidebarItem label="Textfield" url="docs/ui/chrome/textfield" />
            <SidebarItem label="Text" url="docs/ui/chrome/text" />
          </SidebarCollapsibleItem>
        </SidebarSection>
      </ul>
    </div>
  );
}

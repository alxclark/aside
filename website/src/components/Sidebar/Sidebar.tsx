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
    <div className="w-[300px] border-r dark:border-dark-border px-10 overflow-auto">
      <Logo />
      <ul className="max-w-[170px]">
        <SidebarSection>
          <SidebarItem icon="house" label="Home" url="/" />
          <SidebarItem
            icon="play"
            label="Getting started"
            url="guides/getting-started"
          />
          <SidebarItem icon="features" label="Features" url="features" />
          <SidebarItem
            icon="stack"
            label="Architecture"
            url="guides/getting-started"
          />
        </SidebarSection>
        <SidebarSection title="GUIDES">
          <SidebarItem icon="house" label="State management" url="/" />
        </SidebarSection>
        <SidebarSection title="APIs">
          <SidebarItem icon="react" label="React" url="apis/react" />
          <SidebarItem
            icon="storage"
            label="Storage"
            url="guides/getting-started"
          />
        </SidebarSection>
        <SidebarSection title="UI">
          <SidebarCollapsibleItem label="Chrome" icon="chrome">
            <SidebarItem label="Overview" url="ui/chrome" />
            <SidebarItem label="Button" url="ui/chrome/button" />
            <SidebarItem label="Carret" url="ui/chrome/carret" />
            <SidebarItem label="Flex" url="ui/chrome/flex" />
            <SidebarItem label="Icon" url="ui/chrome/icon" />
            <SidebarItem label="Log" url="ui/chrome/log" />
            <SidebarItem label="Navigation" url="ui/chrome/navigation" />
            <SidebarItem label="NavigationTab" url="ui/chrome/navigationTab" />
            <SidebarItem label="Table" url="ui/chrome/table" />
            <SidebarItem label="TableRow" url="ui/chrome/table-row" />
            <SidebarItem label="View" url="ui/chrome/view" />
            <SidebarItem label="Pane" url="ui/chrome/pane" />
            <SidebarItem label="PaneContent" url="ui/chrome/pane-content" />
            <SidebarItem label="PaneToolbar" url="ui/chrome/pane-toolbar" />
            <SidebarItem
              label="PaneToolbarItem"
              url="ui/chrome/pane-toolbar-item"
            />
            <SidebarItem
              label="PaneToolbarSection"
              url="ui/chrome/pane-toolbar-section"
            />
            <SidebarItem label="Tabs" url="ui/chrome/tabs" />
            <SidebarItem label="Tab" url="ui/chrome/tab" />
            <SidebarItem label="Checkbox" url="ui/chrome/checkbox" />
            <SidebarItem label="Divider" url="ui/chrome/divider" />
            <SidebarItem label="Textfield" url="ui/chrome/textfield" />
            <SidebarItem label="Text" url="ui/chrome/text" />
          </SidebarCollapsibleItem>
        </SidebarSection>
      </ul>
    </div>
  );
}

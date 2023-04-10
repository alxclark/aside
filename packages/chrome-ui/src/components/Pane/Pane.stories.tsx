import React, {useState} from 'react';
import {Meta, StoryObj} from '@storybook/react';

import {Checkbox} from '../Checkbox';
import {Button} from '../Button';
import {Tab, Tabs} from '../Tabs';
import {Flex} from '../Flex';
import {TextField} from '../TextField';
import {View} from '../View';

import {PaneToolbar, PaneToolbarItem, PaneToolbarSection} from './components';
import {Pane} from './Pane';

const meta: Meta<typeof Pane> = {
  title: 'ChromeUI/Pane',
  component: Pane,
};

export default meta;
type Story = StoryObj<typeof Pane>;

const Children = () => {
  const [filter, setFilter] = useState<string>('');
  const [showFilter, setShowFilter] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <PaneToolbar>
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Button icon="vertical-ellipsis" title="More tools" />
            <Tabs selected="network" setSelected={console.log}>
              <Tab id="console" label="Console" />
              <Tab id="network" label="Network" />
            </Tabs>
          </Flex>
          <Button icon="close" iconHeight={10} title="Close drawer" />
        </Flex>
      </PaneToolbar>
      <PaneToolbar>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <PaneToolbarSection>
              <Button
                icon="record-on"
                color="rgb(242, 139, 130)"
                title="Stop recording"
                iconHeight={19}
              />
              <Button icon="cancel" title="Clear" />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                icon="filter"
                iconHeight={12}
                pressed={showFilter}
                title="Filter"
                onPress={() => setShowFilter((prev) => !prev)}
              />
              <Button icon="search" title="Search" iconHeight={20} />
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Checkbox
                id="log"
                label="Preserve log"
                checked
                onChange={console.log}
              />
            </PaneToolbarSection>
            <Checkbox
              id="caching"
              label="Disable caching"
              onChange={console.log}
            />
          </Flex>
          <PaneToolbarSection separatorBefore>
            <Button
              icon="cog"
              iconHeight={14}
              pressed={showPreferences}
              onPress={() => setShowPreferences((prev) => !prev)}
            />
          </PaneToolbarSection>
        </Flex>
      </PaneToolbar>
      {showFilter && (
        <PaneToolbar>
          <Flex alignItems="center" gap="4px">
            <View padding="3px 4px">
              <TextField
                value={filter}
                onChange={setFilter}
                placeholder="Filter"
                id="filter"
              />
            </View>
            <Flex wrap gap="7px">
              <Checkbox id="invert" label="Invert" onChange={console.log} />
              <Checkbox
                id="data-urls"
                label="Hide data URLs"
                onChange={console.log}
              />
            </Flex>
          </Flex>
        </PaneToolbar>
      )}
      {showPreferences && (
        <PaneToolbar>
          <Flex>
            <View flexGrow>
              <PaneToolbarItem>
                <Checkbox
                  id="large-rows"
                  label="Use large request rows"
                  onChange={console.log}
                />
              </PaneToolbarItem>
              <PaneToolbarItem>
                <Checkbox
                  id="group-frame"
                  label="Group by frame"
                  onChange={console.log}
                />
              </PaneToolbarItem>
            </View>
            <View flexGrow>
              <PaneToolbarItem>
                <Checkbox
                  id="show-overview"
                  label="Show overview"
                  onChange={console.log}
                />
              </PaneToolbarItem>
              <PaneToolbarItem>
                <Checkbox
                  id="capture-screenshots"
                  label="Capture screenshots"
                  onChange={console.log}
                />
              </PaneToolbarItem>
            </View>
          </Flex>
        </PaneToolbar>
      )}
    </>
  );
};

export const WithAllItsElements: Story = {
  name: 'Chrome network tab',
  args: {
    children: <Children />,
  },
};

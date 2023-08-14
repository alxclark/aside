import React, {useState} from 'react';
import {Meta, StoryObj} from '@storybook/react';

import {Checkbox} from '../Checkbox';
import {Button} from '../Button';
import {Tab, Tabs} from '../Tabs';
import {Flex} from '../Flex';
import {TextField} from '../TextField';
import {View} from '../View';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {Default} from '../Table/Table.stories';
import {Icon} from '../Icon';

import {
  PaneContent,
  PaneToolbar,
  PaneToolbarItem,
  PaneToolbarSection,
} from './components';
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
            <Button title="More tools" size="icon">
              <Icon source="vertical-ellipsis" />
            </Button>
            <Tabs selected="network" setSelected={console.log}>
              <Tab id="console" label="Console" />
              <Tab id="network" label="Network" />
            </Tabs>
          </Flex>
          <Button title="Close drawer" size="icon">
            <Icon source="close" />
          </Button>
        </Flex>
      </PaneToolbar>
      <PaneToolbar>
        <Flex justifyContent="space-between" alignItems="start">
          <Flex alignItems="center" wrap>
            <PaneToolbarSection>
              <Button title="Stop recording" size="icon">
                <Icon source="record-on" variant="error" />
              </Button>
              <Button size="icon">
                <Icon source="cancel" />
              </Button>
            </PaneToolbarSection>
            <PaneToolbarSection>
              <Button
                size="icon"
                title="Filter"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <Icon
                  source="filter"
                  variant={showFilter ? 'toggled' : 'default'}
                />
              </Button>
              <Button title="Search">
                <Icon source="search" />
              </Button>
            </PaneToolbarSection>
            <PaneToolbarSection>
              <PaneToolbarItem>
                <Checkbox
                  id="log"
                  label="Preserve log"
                  checked
                  onChange={console.log}
                />
              </PaneToolbarItem>
            </PaneToolbarSection>
            <PaneToolbarItem>
              <Checkbox
                id="caching"
                label="Disable caching"
                onChange={console.log}
              />
            </PaneToolbarItem>
          </Flex>
          <PaneToolbarSection separatorBefore>
            <Button onClick={() => setShowPreferences((prev) => !prev)}>
              <Icon
                source="cog"
                variant={showPreferences ? 'toggled' : 'default'}
              />
            </Button>
          </PaneToolbarSection>
        </Flex>
      </PaneToolbar>
      {showFilter && (
        <PaneToolbar>
          <Flex alignItems="center" gap="4px" wrap>
            <View padding="3px 4px" width={163}>
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
      <PaneContent>
        <Default {...Default.args} />
      </PaneContent>
    </>
  );
};

export const WithAllItsElements: Story = {
  name: 'Chrome network tab',
  args: {
    children: <Children />,
  },
};

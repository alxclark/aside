/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import '../../../../../.storybook/styles.css';
import {Flex, ConsoleMessage, View} from '..';
import {Icon} from '../Icon';

import {Table, Props} from './Table';
import {TableRow, TableCell} from './components';

export default {
  title: 'ChromeUI/Table',
  component: Table,
};

const Template = (args: any) => <Table {...args} />;

const data = Array.from(Array(5)).map(() => ({
  name: 'progress',
  status: 200,
  type: 'eventsource',
  initiator: 'Other',
  time: '232 ms',
}));

function Children() {
  return (
    <>
      {data.map((item) => (
        <TableRow key={item.name} id={item.name}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{item.initiator}</TableCell>
          <TableCell>{item.time}</TableCell>
          <TableCell />
        </TableRow>
      ))}
    </>
  );
}

export const Default = Template.bind({}) as any;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  columns: [
    {title: 'Name', width: 150},
    {title: 'Status', width: 50},
    {title: 'Type', width: 75},
    {title: 'Initiator', width: 100},
    {title: 'Time', width: 50},
    {title: 'Waterfall'},
  ],
  rowHeight: '20px',
  children: <Children />,
} as Props;

const TimelineTemplate = () => <TimelineExample />;

export const Timeline = TimelineTemplate.bind({}) as any;

function TimelineExample() {
  return (
    <Flex fullHeight>
      <View width={150}>
        <Table
          columns={[{title: 'Name', width: 30}]}
          border={false}
          rowHeight="17px"
        >
          <TableRow id="1">
            <TableCell>
              <Flex gap="5px" alignItems="center">
                <View margin="0 0 0 2px">
                  <Icon source="start" color="#2883ff" height={13} />
                </View>
                todo:1, todos
              </Flex>
            </TableCell>
          </TableRow>
          <TableRow id="2">
            <TableCell>
              <Flex gap="5px" alignItems="center">
                <View margin="0 0 0 1px">
                  <Icon source="curly" color="#e5ab04" height={15} />
                </View>
                todo:2, todos
              </Flex>
            </TableCell>
          </TableRow>
          <TableRow id="3">
            <TableCell>
              <Flex gap="5px" alignItems="center">
                <View margin="0 0 0 1px">
                  <Icon source="curly" color="#e5ab04" height={15} />
                </View>
                todo:2
              </Flex>
            </TableCell>
          </TableRow>
        </Table>
      </View>
      <View flexGrow border="left">
        <ConsoleMessage value={{something: {else: 'hey'}, else: 5}} />
      </View>
    </Flex>
  );
}

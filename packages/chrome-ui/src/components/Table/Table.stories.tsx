/* eslint-disable import/no-anonymous-default-export */
import React, {useState} from 'react';

import {TableRow} from './components';
import {TableCell} from './components/TableCell';
import {Table, Props} from './Table';

export default {
  title: 'ChromeUI/Table',
  component: Table,
};

const Template = (args: any) => <Table {...args} />;

const data = [
  {
    name: 'progress',
    status: 200,
    type: 'eventsource',
    initiator: 'Other',
    time: '232 ms',
  },
  {
    name: 'main.js',
    status: 200,
    type: 'script',
    initiator: 'iframe.html',
    time: '6 ms',
  },
];

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
    {title: 'Status', width: 30},
    {title: 'Type', width: 75},
    {title: 'Initiator', width: 100},
    {title: 'Time', width: 50},
    {title: 'Waterfall'},
  ],
  children: <Children />,
} as Props;

const TimelineTemplate = () => <TimelineExample />;

export const Timeline = TimelineTemplate.bind({}) as any;

function TimelineExample() {
  const [selected, setSelected] = useState();

  return (
    <>
      <Table columns={[{title: 'Name'}]}>
        <TableRow id="1">
          <TableCell>todo:0, todos</TableCell>
        </TableRow>
      </Table>
    </>
  );
}

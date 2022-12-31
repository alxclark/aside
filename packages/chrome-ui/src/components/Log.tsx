import React, {useState} from 'react';

import {Carret} from './Carret';

export interface LogItem {
  value: any;
  onPress?: () => void;
}

export interface Props {
  items: LogItem[];
}

export function Log({items}: Props) {
  return (
    <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b">
      {items.map((item) => (
        <LogItem item={item} />
      ))}
    </div>
  );
}

export function LogItem({item}: {item: LogItem}) {
  return (
    <>
      <Renderer value={item.value} />
    </>
  );
}

export function ObjectRenderer({value}: {value: {[key: string]: any}}) {
  const [collapsed, setCollapsed] = useState(true);

  const keys = Object.keys(value);

  return (
    <>
      <button className="italic" onClick={() => setCollapsed((prev) => !prev)}>
        <Carret direction={collapsed ? 'right' : 'down'} />
        <span className="text-white">{'{'}</span>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <span className="text-console-object-gray">{key}</span>:{' '}
            <Renderer value={value[key]} />
            {index !== keys.length - 1 && <>, </>}
          </React.Fragment>
        ))}
        <span className="text-white">{'}'}</span>
      </button>
      {!collapsed && (
        <div className="flex flex-col items-start pl-[23px]">
          {keys.map((key) => (
            <div key={key}>
              <span className="text-console-object-blue font-bold">{key}</span>:{' '}
              <Renderer value={value[key]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function StringRenderer({value}: {value: string}) {
  return <span className="text-console-object-cyan">&apos;{value}&apos;</span>;
}

export function NumberRenderer({value}: {value: number}) {
  return <span className="text-console-object-purple">{value}</span>;
}

export function Renderer({value}: {value: any}) {
  switch (typeof value) {
    case 'object':
      return <ObjectRenderer value={value} />;
    case 'string':
      return <StringRenderer value={value} />;
    case 'number':
      return <NumberRenderer value={value} />;
    default:
      return <>?</>;
  }
}

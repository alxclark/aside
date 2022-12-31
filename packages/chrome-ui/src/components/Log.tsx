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
    <div className="px-6 py-[2px] font-menlo text-code-gray text-[11px] border-b flex flex-wrap">
      {items.map((item) => (
        <LogItem item={item} />
      ))}
    </div>
  );
}

export function LogItem({item}: {item: LogItem}) {
  return (
    <>
      <Renderer value={item.value} name="hey" />
    </>
  );
}

export function ObjectRenderer({
  value,
  name,
}: {
  value: {[key: string]: any};
  name: string;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const keys = Object.keys(value);

  return (
    <button className="italic" onClick={() => setCollapsed((prev) => !prev)}>
      <Carret />
      <span className="text-white">{'{'}</span>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Renderer name={key} value={value[key]} />
          {index !== keys.length - 1 && <>, </>}
        </React.Fragment>
      ))}
      <span className="text-white">{'}'}</span>
    </button>
  );
}

export function StringRenderer({value, name}: {value: string; name: string}) {
  return (
    <>
      <span className="text-console-object-gray">{name}</span>:{' '}
      <span className="text-console-object-cyan">&apos;{value}&apos;</span>
    </>
  );
}

export function NumberRenderer({value, name}: {value: number; name: string}) {
  return (
    <>
      <span className="text-console-object-gray">{name}</span>:{' '}
      <span className="text-console-object-purple">{value}</span>
    </>
  );
}

export function Renderer({value, name}: {value: any; name: string}) {
  switch (typeof value) {
    case 'object':
      return <ObjectRenderer value={value} name={name} />;
    case 'string':
      return <StringRenderer value={value} name={name} />;
    case 'number':
      return <NumberRenderer value={value} name={name} />;
    default:
      return <>?</>;
  }
}

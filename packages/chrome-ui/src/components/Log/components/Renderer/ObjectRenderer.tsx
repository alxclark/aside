import React, {useState} from 'react';
import classNames from 'classnames';

import {Carret} from '../../../Carret';

// eslint-disable-next-line import/no-cycle
import {Renderer} from './Renderer';

export function ObjectRenderer0({
  value,
  collapsed: collapsedParent,
  nested,
  path,
}: {
  value: {[key: string]: any};
  collapsed?: boolean;
  nested?: boolean;
  path: string[];
}) {
  const [collapsed, setCollapsed] = useState(true);

  const keys = Object.keys(value);

  if (collapsedParent) {
    return <span className="text-white">{'{…}'}</span>;
  }

  return (
    <>
      <button className="italic" onClick={() => setCollapsed((prev) => !prev)}>
        {!nested && <Carret direction={collapsed ? 'right' : 'down'} />}
        <span className="text-white">{'{'}</span>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            {typeof value[key] === 'object' && (
              <>
                <span className="text-console-object-gray">{key}</span>
                {': '}
              </>
            )}
            <Renderer value={value[key]} collapsed path={[...path, key]} />
            {index !== keys.length - 1 && <>, </>}
          </React.Fragment>
        ))}
        <span className="text-white">{'}'}</span>
      </button>
      {!collapsed && (
        <div
          className={classNames(
            'flex flex-col items-start pl-[23px]',
            nested && 'pl-[10px]',
          )}
        >
          {keys.map((key) => (
            <div key={key}>
              {typeof value[key] === 'object' && (
                <button>
                  <Carret direction={collapsed ? 'right' : 'down'} />
                  <span className="text-console-object-blue font-bold">
                    {key}
                  </span>
                  {': '}
                </button>
              )}
              <Renderer value={value[key]} nested path={[...path, key]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function ObjectRenderer({
  value,
  collapsed: collapsedParent,
  nested,
  path,
}: {
  value: {[key: string]: any};
  collapsed?: boolean;
  nested?: boolean;
  path: string[];
}) {
  const [collapsed, setCollapsed] = useState(true);

  const keys = Object.keys(value);
  const lastKey = path[path.length - 1];

  if (collapsedParent) {
    return (
      <>
        <span className="text-console-object-gray">{lastKey}</span>
        {': '}
        <span className="text-white">{'{…}'}</span>
      </>
    );
  }

  const showCollapsed = !nested || collapsed;

  return (
    <>
      <button
        className="ml-[-10px]"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <Carret direction={collapsed ? 'right' : 'down'} />
        {path.length > 0 && (
          <>
            <span className="text-console-object-blue font-bold">
              {lastKey}
            </span>
            {': '}
          </>
        )}
        {showCollapsed && (
          <span className="italic">
            <span className="text-white">{'{'}</span>
            {keys.map((key, index) => (
              <React.Fragment key={key}>
                <Renderer value={value[key]} collapsed path={[...path, key]} />
                {index !== keys.length - 1 && <>, </>}
              </React.Fragment>
            ))}
            <span className="text-white">{'}'}</span>
          </span>
        )}
      </button>

      {!collapsed && (
        <div
          className={classNames(
            'flex flex-col items-start pl-[23px]',
            nested && 'pl-[10px]',
          )}
        >
          {keys.map((key) => (
            <div key={key}>
              <Renderer value={value[key]} nested path={[...path, key]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

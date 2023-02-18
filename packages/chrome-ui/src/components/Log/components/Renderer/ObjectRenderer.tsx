import React, {useState} from 'react';
import classNames from 'classnames';

import {Carret} from '../../../Carret';

// eslint-disable-next-line import/no-cycle
import {Renderer} from './Renderer';

export function ObjectRenderer({
  value,
  collapsed: collapsedParent,
  nested,
  path,
}: {
  value: {[key: string]: any} | null;
  collapsed?: boolean;
  nested?: boolean;
  path: string[];
}) {
  const [collapsed, setCollapsed] = useState(nested);
  const lastKey = path[path.length - 1];

  if (value === null || value === undefined) {
    return (
      <>
        <span
          className={classNames(
            collapsedParent
              ? 'text-console-object-gray'
              : 'text-console-object-blue font-bold',
          )}
        >
          {lastKey}
        </span>
        {': '}
        <span className="text-console-object-gray">
          {value === null ? 'null' : 'undefined'}
        </span>
      </>
    );
  }

  const keys = Object.keys(value).sort();

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
          <span className={classNames(!nested && 'italic')}>
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
            'flex flex-col items-start pl-[12px]',
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

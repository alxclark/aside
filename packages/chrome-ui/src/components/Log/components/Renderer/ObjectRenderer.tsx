import React, {useState} from 'react';
import classNames from 'classnames';

import {Carret} from '../../../Carret';

// eslint-disable-next-line import/no-cycle
import {Renderer} from './Renderer';

export function ObjectRenderer({
  value,
  collapsedParent,
  nested,
}: {
  value: {[key: string]: any};
  collapsedParent?: boolean;
  nested?: boolean;
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
            <span className="text-console-object-gray">{key}</span>:{' '}
            <Renderer value={value[key]} collapsedParent />
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
                <Carret direction={collapsed ? 'right' : 'down'} />
              )}
              <span className="text-console-object-blue font-bold">{key}</span>:{' '}
              <Renderer value={value[key]} nested />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

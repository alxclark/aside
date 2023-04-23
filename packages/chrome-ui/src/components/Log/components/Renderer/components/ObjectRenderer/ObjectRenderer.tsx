import React, {useState} from 'react';
import classNames from 'classnames';

import {Carret} from '../../../../../Carret';
// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../Renderer';
import {isDiff} from '../../../../utilities';
import {DefaultRenderer} from '../DefaultRenderer';

// eslint-disable-next-line import/no-cycle
import {DiffRenderer, ArrayRenderer} from './components';

export function ObjectRenderer({
  value,
  preview,
  nested = false,
  path,
  collapsible,
}: {
  value: {[key: string]: any} | null;
  preview?: boolean;
  nested?: boolean;
  path: string[];
  collapsible: boolean;
}) {
  const [collapsed, setCollapsed] = useState(nested);
  const lastKey = path[path.length - 1];

  if (isDiff(value)) {
    return <DiffRenderer path={path} value={value} preview={preview} />;
  }

  if (Array.isArray(value)) {
    return (
      <ArrayRenderer
        value={value}
        preview={preview}
        collapsible={collapsible}
        path={path}
      />
    );
  }

  if (value === null) {
    return <DefaultRenderer value="null" />;
  }

  const keys = Object.keys(value).sort();

  if (preview) {
    return (
      <>
        <span className="text-white">{'{…}'}</span>
      </>
    );
  }

  const showChildPreview = !nested || collapsed;

  return (
    <>
      <button
        className="ml-[-10px] text-left"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsible && <Carret direction={collapsed ? 'right' : 'down'} />}
        {path.length > 0 && (
          <>
            <span className="text-console-object-blue font-bold">
              {lastKey}
            </span>
            {': '}
          </>
        )}
        {showChildPreview && (
          <span className={classNames(!nested && 'italic')}>
            <span className="text-white">{'{'}</span>
            {keys.map((key, index) => (
              <React.Fragment key={key}>
                <span className={classNames('text-console-object-gray')}>
                  {key}
                </span>
                {': '}
                <Renderer value={value[key]} preview path={[...path, key]} />
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
              {typeof value[key] !== 'object' && (
                <>
                  <span
                    className={classNames(
                      'text-console-object-gray',
                      !collapsed && 'text-console-object-blue font-bold',
                    )}
                  >
                    {key}
                  </span>
                  :{' '}
                </>
              )}
              <Renderer value={value[key]} nested path={[...path, key]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

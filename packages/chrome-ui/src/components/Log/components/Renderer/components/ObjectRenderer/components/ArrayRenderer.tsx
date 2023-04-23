import React, {useState} from 'react';
import classNames from 'classnames';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {Carret} from '../../../../../../Carret';

export function ArrayRenderer({
  value,
  preview,
  path,
  collapsible = true,
}: {
  value: any[];
  preview?: boolean;
  path: string[];
  collapsible?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(true);

  if (preview) {
    return <SimplePreview length={value.length} />;
  }

  const key = path[path.length - 1];

  return (
    <>
      <button
        className="ml-[-10px] text-left"
        disabled={!collapsible}
        onClick={() => {
          if (collapsible) {
            setCollapsed((prev) => !prev);
          }
        }}
      >
        {collapsible && <Carret direction={collapsed ? 'right' : 'down'} />}
        {path.length > 0 && (
          <>
            <span className="text-console-object-blue font-bold">{key}</span>
            {': '}
            {collapsed ? (
              <DescriptivePreview value={value} />
            ) : (
              <SimplePreview length={value.length} />
            )}
          </>
        )}
      </button>
      {!collapsed && (
        <div className="pl-[10px]">
          {value.map((child, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              {child && (
                <>
                  <span
                    className={classNames('text-console-object-blue font-bold')}
                  >
                    {index}
                  </span>
                  :{' '}
                </>
              )}
              <Renderer value={child} nested path={[...path, key]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SimplePreview({length}: {length: number}) {
  return <span className="text-white">Array({length})</span>;
}

function DescriptivePreview({value}: {value: any[]}) {
  return (
    <>
      <span className="text-console-object-gray">({value.length})</span>
      <span className="text-white">
        {' '}
        [
        {value.map((child, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <Renderer value={child} preview />
            {index !== value.length - 1 && <>{', '}</>}
          </React.Fragment>
        ))}
        ]
      </span>
    </>
  );
}

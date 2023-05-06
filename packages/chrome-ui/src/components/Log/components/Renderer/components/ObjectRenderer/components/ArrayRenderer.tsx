import React, {useState} from 'react';
import classNames from 'classnames';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
// eslint-disable-next-line import/no-cycle
import {KeyValueRenderer} from '../../KeyValueRenderer';

export function ArrayRenderer({
  value,
  preview,
  path,
  collapsed = true,
}: {
  value: any[];
  preview?: boolean;
  path: string[];
  collapsed?: boolean;
}) {
  if (preview) {
    return collapsed ? (
      <DescriptivePreview value={value} />
    ) : (
      <SimplePreview length={value.length} />
    );
  }

  if (collapsed) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      {value.map((child, index) => (
        <KeyValueRenderer
          value={child}
          path={[...path, index.toString()]}
          key={[...path, index.toString()].join()}
        />
      ))}
    </div>
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

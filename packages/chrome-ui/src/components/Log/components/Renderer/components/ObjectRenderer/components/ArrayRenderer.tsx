import React, {useState} from 'react';
import classNames from 'classnames';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
// eslint-disable-next-line import/no-cycle
import {KeyValueRenderer} from '../../KeyValueRenderer';
import {useRenderer} from '../../../../../hooks';

export function ArrayRenderer({
  value,
  preview,
  path,
  depth = 0,
}: {
  value: any[];
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const open = renderer.opened[key];

  if (preview) {
    console.log({depth});
    if (open || depth > 0) {
      return <SimplePreview length={value.length} />;
    }

    return <DescriptivePreview value={value} />;
  }

  if (!open) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      {value.map((child, index) => (
        <div key={[...path, index.toString()].join()}>
          <KeyValueRenderer value={child} path={[...path, index.toString()]} />
        </div>
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
            <Renderer value={child} preview depth={1} />
            {index !== value.length - 1 && <>{', '}</>}
          </React.Fragment>
        ))}
        ]
      </span>
    </>
  );
}

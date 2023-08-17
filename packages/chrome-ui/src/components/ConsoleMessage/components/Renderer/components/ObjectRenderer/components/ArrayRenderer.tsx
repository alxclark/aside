import React from 'react';

// eslint-disable-next-line import/no-cycle
import {Renderer} from '../../../Renderer';
import {KeyValueRenderer} from '../../KeyValueRenderer';
import {useRenderer} from '../../../../../hooks';

export function ArrayRenderer({
  value,
  previous,
  preview,
  path,
  depth = 0,
}: {
  value: any[];
  previous?: any[];
  preview?: boolean;
  path: string[];
  depth?: number;
}) {
  const renderer = useRenderer();
  const key = path.join('.');
  const open = renderer.opened[key];

  if (preview) {
    if (open || depth > 0) {
      return <SimplePreview length={value.length} />;
    }

    return <DescriptivePreview value={value} path={path} />;
  }

  if (!open) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      {value.map((child, index) => (
        <div key={[...path, index.toString()].join()}>
          <KeyValueRenderer
            value={child}
            previous={previous?.[index]}
            path={[...path, index.toString()]}
          />
        </div>
      ))}
      {renderer.showPreviousValues &&
        previous &&
        previous.length > value.length &&
        previous.slice(value.length).map((child, index) => (
          <div key={`${child}`}>
            <KeyValueRenderer
              value={child}
              path={[...path, (index + value.length).toString()]}
              linethrough
              muted
            />
          </div>
        ))}
    </div>
  );
}

function SimplePreview({length}: {length: number}) {
  return <span className="text-console-array">Array({length})</span>;
}

function DescriptivePreview({value, path}: {value: any[]; path: string[]}) {
  return (
    <>
      {value.length > 0 && (
        <span className="text-console-preview">({value.length})</span>
      )}
      <span className="text-console-array">
        {value.length > 0 && ' '}[
        {value.map((child, index) => (
          <React.Fragment key={`${child}`}>
            <Renderer
              value={child}
              preview
              depth={1}
              path={[...path, index.toString()]}
            />
            {index !== value.length - 1 && <>{', '}</>}
          </React.Fragment>
        ))}
        ]
      </span>
    </>
  );
}

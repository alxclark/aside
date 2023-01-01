import React from 'react';

import {NumberRenderer} from './NumberRenderer';
// eslint-disable-next-line import/no-cycle
import {ObjectRenderer} from './ObjectRenderer';
import {StringRenderer} from './StringRenderer';

export function Renderer({
  value,
  collapsedParent,
  nested,
}: {
  value: any;
  collapsedParent?: boolean;
  nested?: boolean;
}) {
  switch (typeof value) {
    case 'object':
      return (
        <ObjectRenderer
          value={value}
          collapsedParent={collapsedParent}
          nested={nested}
        />
      );
    case 'string':
      return <StringRenderer value={value} />;
    case 'number':
      return <NumberRenderer value={value} />;
    default:
      return <>?</>;
  }
}

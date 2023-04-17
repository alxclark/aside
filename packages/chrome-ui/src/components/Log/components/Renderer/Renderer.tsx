import React from 'react';

import {isDiff} from '../../utilities';

import {NumberRenderer} from './NumberRenderer';
// eslint-disable-next-line import/no-cycle
import {ObjectRenderer} from './ObjectRenderer';
import {StringRenderer} from './StringRenderer';

export function Renderer({
  value,
  collapsed,
  nested,
  path = [],
  previousValue,
  showDiffs = false,
}: {
  value: any;
  collapsed?: boolean;
  nested?: boolean;
  path?: string[];
  previousValue?: any;
  showDiffs?: boolean;
}) {
  switch (typeof value) {
    case 'string':
      return (
        <StringRenderer
          value={value}
          path={path}
          collapsed={collapsed}
          previousValue={previousValue}
          showDiffs={showDiffs}
        />
      );
    case 'number':
      return (
        <NumberRenderer
          value={value}
          path={path}
          collapsed={collapsed}
          previousValue={previousValue}
          showDiffs={showDiffs}
        />
      );
    case 'object':
      if (isDiff(value)) {
        return (
          <Renderer
            value={value.next}
            path={path}
            collapsed={collapsed}
            nested={nested}
            previousValue={value.previous}
            showDiffs={showDiffs}
          />
        );
      }

      return (
        <ObjectRenderer
          value={value}
          collapsed={collapsed}
          nested={nested}
          path={path}
          previousValue={previousValue}
          showDiffs={showDiffs}
        />
      );
    default:
      return <></>;
  }
}

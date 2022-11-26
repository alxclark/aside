import React, {useCallback} from 'react';
import classNames from 'classnames';

import {useNavigation} from '../hooks';

export interface Props {
  label: string;
  value: string;
}

export function Tab({label, value}: Props) {
  const {navigate, selected} = useNavigation();

  window.__companion.log({selected});

  const className = classNames(
    'h-[26px] text-gray-300 px-3 font-sans',
    selected === value && 'bg-black text-white',
  );

  const handleClick = useCallback(() => {
    navigate(value);
  }, [navigate, value]);

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
}

'use client';

import Link from 'next/link';
import React, {useMemo} from 'react';
import classNames from 'classnames';

export interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  href?: string;
  variant?: 'subdued';
}

export function Button({children, onPress, href, variant}: Props) {
  const baseClasses =
    'flex font-semibold items-center gap-2 font-medium text-sm bg-accent text-dark-surface px-5 py-2 b rounded-full';

  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'subdued': {
        return 'bg-dark-text text-dark-surface';
      }
      default:
        return '';
    }
  }, [variant]);

  const className = classNames(baseClasses, variantClasses);

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onPress} className={className}>
      {children}
    </button>
  );
}

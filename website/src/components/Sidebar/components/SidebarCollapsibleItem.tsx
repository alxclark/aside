'use client';

import {PropsWithChildren, useState} from 'react';
import Image from 'next/image';

export function SidebarCollapsibleItem({
  label,
  children,
  icon,
}: PropsWithChildren<{
  icon?: string;
  label: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center justify-between text-sm w-full grayscale"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex gap-3">
          {icon && (
            <Image alt={icon} height={16} width={16} src={`/${icon}.svg`} />
          )}
          {label}
        </div>
        {open ? (
          <Image alt="down" src="/chevron.svg" height={16} width={16} />
        ) : (
          <Image alt="right" src="/chevron-right.svg" height={16} width={16} />
        )}
      </button>
      {open && (
        <div className="pl-7 ml-1.5 border-l-2 dark:border-dark-border flex flex-col gap-3">
          {children}
        </div>
      )}
    </>
  );
}

import Image from 'next/image';
import React from 'react';

import {webstoreUrl} from '@/constants';

export interface Props {}

export function Topbar() {
  return (
    <>
      <header className="dark:bg-dark-surface flex sticky top-0 w-full h-[65px] items-center border-b dark:border-dark-border px-3 justify-end gap-6">
        <div className="md:hidden text-accent font-black text-3xl leading-4 relative grow">
          <div className="bg-accent h-4 w-4 rounded-full" />
        </div>

        <a href="https://github.com/alxclark/aside">
          <Image alt="Github" src="/github.svg" width={25} height={25} />
        </a>
        <a
          href={webstoreUrl}
          className="flex font-semibold items-center gap-2 font-medium text-sm bg-accent text-dark-surface px-3 py-2 rounded-lg"
        >
          Download
        </a>
      </header>
    </>
  );
}

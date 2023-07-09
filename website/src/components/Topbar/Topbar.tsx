import Image from 'next/image';
import React from 'react';

import {webstoreUrl} from '@/constants';

export interface Props {}

export function Topbar() {
  return (
    <>
      <header className="flex sticky top-0 w-full h-[65px] items-center border-b dark:border-dark-border px-3 justify-end gap-6">
        <div className="md:hidden text-accent font-black text-3xl leading-4 relative grow">
          aside
        </div>
        <a className="text-sm" href="https://recoil.aside.dev">
          Demo
        </a>

        <a href="https://github.com/alxclark/aside">
          <Image alt="Github" src="/github.svg" width={25} height={25} />
        </a>
        <a
          href={webstoreUrl}
          className="flex font-semibold items-center gap-2 font-medium text-sm bg-accent text-dark-surface px-5 py-2 rounded-full"
        >
          <Image alt="" src="/magic.svg" height={20} width={20} />
          Download
        </a>
      </header>
    </>
  );
}

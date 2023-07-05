'use client';

import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import classNames from 'classnames';

export function SidebarItem({
  label,
  url,
  icon,
}: {
  icon?: string;
  label: string;
  url: string;
}) {
  const href = `/${url}`;
  const pathname = usePathname();
  const active = href === pathname;

  return (
    <Link href={href}>
      <li
        className={classNames(
          'text-sm flex gap-3 py-1 px-2 rounded-md',
          active && 'dark:bg-dark-surface2 text-accent',
        )}
      >
        {icon && (
          <Image
            alt={icon}
            height={16}
            width={16}
            src={`/${icon}.svg`}
            className="grayscale"
          />
        )}
        {label}
      </li>
    </Link>
  );
}
// background: hsl(0 0% 9% / 1);
// padding: 6px 4px;
// border-radius: 8px;
// margin: -6px;

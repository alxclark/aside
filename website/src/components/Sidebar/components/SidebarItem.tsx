import Link from 'next/link';
import Image from 'next/image';

export function SidebarItem({
  label,
  url,
  icon,
}: {
  icon?: string;
  label: string;
  url: string;
}) {
  return (
    <Link href={url}>
      <li className="text-sm flex gap-3 grayscale">
        {icon && (
          <Image alt={icon} height={16} width={16} src={`/${icon}.svg`} />
        )}
        {label}
      </li>
    </Link>
  );
}

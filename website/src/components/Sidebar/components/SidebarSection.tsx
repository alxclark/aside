import {PropsWithChildren} from 'react';

export function SidebarSection({
  children,
  title,
}: PropsWithChildren<{title?: string}>) {
  return (
    <div className="flex flex-col gap-4 pb-5">
      {title && (
        <div className="font-mono text-xs dark:text-dark-mono">{title}</div>
      )}
      {children}
      <div className="h-px w-full bg-dark-separator" />
    </div>
  );
}

import Image from 'next/image';

export function Logo() {
  return (
    <div className="pb-10 pt-8 dark:bg-dark-surface z-10">
      <div className="text-accent font-black text-3xl leading-4 relative">
        <div className="bg-accent h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}

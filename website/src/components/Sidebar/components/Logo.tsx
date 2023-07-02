import Image from 'next/image';

export function Logo() {
  return (
    <div className="pb-10 top-0 sticky pt-8 dark:bg-dark-surface z-10">
      <Image
        src="/aside.svg"
        alt="Vercel Logo"
        width={70}
        height={16}
        priority
      />
    </div>
  );
}

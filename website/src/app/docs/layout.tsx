import {Sidebar, Topbar} from '@/components';

export default function DocsLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full">
        <Topbar />
        <main className="px-5 pt-8">{children}</main>
      </div>
    </div>
  );
}

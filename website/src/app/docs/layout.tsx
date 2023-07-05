import {Sidebar, Topbar} from '@/components';

export default function DocsLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full overflow-auto ">
        <Topbar />
        <main className="px-5 pt-8 max-w-3xl m-auto">{children}</main>
      </div>
    </div>
  );
}

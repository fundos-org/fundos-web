import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SideBarNav from './SideBarNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarNav />
      <main className="p-10 w-full">
        <SidebarTrigger className="md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  );
}

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SideBarNav from './SideBarNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarNav />
      <main className="fundos-dashboard-container w-full fundos-main-content-admin">
        <SidebarTrigger className="md:hidden mb-4" />
        {children}
      </main>
    </SidebarProvider>
  );
}

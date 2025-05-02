import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBarNav from "./SideBarNav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarNav />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

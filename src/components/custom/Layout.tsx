import { SidebarProvider } from "@/components/ui/sidebar";
import SideBarNav from "./SideBarNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarNav />
      <main className="py-5 px-10 w-full">
        {/* <SidebarTrigger /> */}
          {/* <h2 className="text-4xl">Welcome Back, Kota</h2> */}
          {/* <div className="mb-8">
          <small className="text-gray-500">
            Measure your advertising ROI and report website traffic
          </small>
          </div> */}
        {children}
      </main>
    </SidebarProvider>
  );
}

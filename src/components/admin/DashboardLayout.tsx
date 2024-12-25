import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        {/* Sidebar for desktop */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-64">
          <DashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 w-full md:ml-64 min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-7xl text-center md:text-left">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
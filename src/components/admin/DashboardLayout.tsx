import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        {/* Sidebar for desktop */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-20">
          <DashboardSidebar />
        </div>

        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <DashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 w-full md:ml-20 min-h-screen pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex h-[calc(100vh-4rem)] fixed left-0 top-16 w-20 z-40">
          <DashboardSidebar />
        </div>

        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-accent border-t border-gray-800 z-40">
          <DashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 w-full md:ml-20 pb-24 md:pb-0">
          <div className="container mx-auto px-4 py-8 max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
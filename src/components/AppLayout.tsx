import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Shield } from "lucide-react";

export function AppLayout() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex items-center gap-2 mr-4">
              <SidebarTrigger />
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">DigiAegis360</span>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="hidden sm:block">
                Secure Certificate Verification System
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import InstitutionUpload from "./pages/InstitutionUpload";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlockchainCertificate from "./pages/BlockchainCertificate";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminPortal />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="/blockchain-certificate" element={<BlockchainCertificate />} />
        <Route path="/institution-upload" element={<InstitutionUpload />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SiteHeader from "@/components/SiteHeader";
import Boka from "@/pages/Boka";
import IfkStocksund from "@/pages/IfkStocksund";
import Kontakt from "@/pages/Kontakt";
import Om from "@/pages/Om";
import Tjanster from "@/pages/Tjanster";
import TjansterDetail from "@/pages/TjansterDetail";
import { VisitorProvider } from "@/context/VisitorContext";
import Analytics from "@/components/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VisitorProvider>
          <Analytics />
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ifk-stocksund" element={<IfkStocksund />} />
            <Route path="/boka" element={<Boka />} />
            <Route path="/tjanster" element={<Tjanster />} />
            <Route path="/tjanster/:slug" element={<TjansterDetail />} />
            <Route path="/om" element={<Om />} />
            <Route path="/kontakt" element={<Kontakt />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VisitorProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

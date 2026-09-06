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
import Forening from "@/pages/Forening";
import ForeningTranare from "@/pages/ForeningTranare";
import ForeningSpelare from "@/pages/ForeningSpelare";
import HalkopparBarn from "@/pages/HalkopparBarn";
import PermanentRedirect from "@/components/PermanentRedirect";
import {
  HEEL_CUP_LEGACY_PATHS,
  HEEL_CUP_SERVICE_PATH,
} from "@/data/tjanster";
import { VisitorProvider } from "@/context/VisitorContext";
import Analytics from "@/components/Analytics";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VisitorProvider>
          <ScrollToTop />
          <Analytics />
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ifk-stocksund" element={<IfkStocksund />} />
            <Route path="/boka" element={<Boka />} />
            <Route path="/tjanster" element={<Tjanster />} />
            <Route path="/tjanster/halkoppar-barn" element={<HalkopparBarn />} />
            {HEEL_CUP_LEGACY_PATHS.map((from) => (
              <Route
                key={from}
                path={from}
                element={<PermanentRedirect to={HEEL_CUP_SERVICE_PATH} />}
              />
            ))}
            <Route path="/tjanster/:slug" element={<TjansterDetail />} />
            <Route path="/om" element={<Om />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/forening" element={<Forening />} />
            <Route path="/forening/tranare" element={<ForeningTranare />} />
            <Route path="/forening/spelare" element={<ForeningSpelare />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VisitorProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SiteHeader from "@/components/SiteHeader";
import Boka from "@/pages/Boka";
import IfkStocksund from "@/pages/IfkStocksund";
import EnebybergsIf from "@/pages/EnebybergsIf";
import FcDjursholm from "@/pages/FcDjursholm";
import Kontakt from "@/pages/Kontakt";
import Om from "@/pages/Om";
import Tjanster from "@/pages/Tjanster";
import TjansterDetail from "@/pages/TjansterDetail";
import Forening from "@/pages/Forening";
import ForeningTranare from "@/pages/ForeningTranare";
import ForeningKlubb from "@/pages/ForeningKlubb";
import HalkopparBarn from "@/pages/HalkopparBarn";
import ErbjudandenFriskvard from "@/pages/erbjudanden/Friskvard";
import ErbjudandenKassa from "@/pages/erbjudanden/Kassa";
import ErbjudandenBoka from "@/pages/erbjudanden/Boka";
import ErbjudandenKvitto from "@/pages/erbjudanden/Kvitto";
import Personuppgifter, { PRIVACY_PATH } from "@/pages/Personuppgifter";
import { WELLNESS_RECEIPT_PATH } from "@/data/caseloCompany";
import PermanentRedirect from "@/components/PermanentRedirect";
import {
  HEEL_CUP_LEGACY_PATHS,
  HEEL_CUP_SERVICE_PATH,
  PERFORMANCE_LEGACY_PATH,
  PERSONAL_TRAINING_PATH,
} from "@/data/tjanster";
import { VisitorProvider } from "@/context/VisitorContext";
import Analytics from "@/components/Analytics";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const SnabbhetRedirect = () => {
  const { hash } = useLocation();
  const mapped =
    hash === "#bestall" || hash === "#presentkort" || hash === "#ingar"
      ? hash
      : "#snabbhet";
  return <PermanentRedirect to={`${PERSONAL_TRAINING_PATH}${mapped}`} />;
};

/** Gamla adressen /erbjudanden/friskvard: behåll frågesträng och ankare. */
const PersonalTrainingRedirect = () => {
  const { search, hash } = useLocation();
  return <PermanentRedirect to={`${PERSONAL_TRAINING_PATH}${search}${hash}`} />;
};

const AppLayout = () => (
  <VisitorProvider>
    <ScrollToTop />
    <Analytics />
    <SiteHeader />
    <Outlet />
  </VisitorProvider>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Index />} />
      <Route path="/ifk-stocksund" element={<IfkStocksund />} />
      <Route path="/enebybergs-if" element={<EnebybergsIf />} />
      <Route path="/fc-djursholm" element={<FcDjursholm />} />
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
      <Route
        path={PERFORMANCE_LEGACY_PATH}
        element={<PermanentRedirect to={PERSONAL_TRAINING_PATH} />}
      />
      <Route path="/tjanster/:slug" element={<TjansterDetail />} />
      <Route path="/om" element={<Om />} />
      <Route path="/kontakt" element={<Kontakt />} />
      <Route path={PRIVACY_PATH} element={<Personuppgifter />} />
      <Route path="/forening" element={<Forening />} />
      <Route path="/forening/klubb" element={<ForeningKlubb />} />
      <Route path="/forening/tranare" element={<ForeningTranare />} />
      <Route
        path="/forening/spelare"
        element={<PermanentRedirect to="/boka" />}
      />
      <Route path="/erbjudanden/snabbhet" element={<SnabbhetRedirect />} />
      <Route path={PERSONAL_TRAINING_PATH} element={<ErbjudandenFriskvard />} />
      <Route path="/erbjudanden/friskvard" element={<PersonalTrainingRedirect />} />
      <Route path="/erbjudanden/kassa" element={<ErbjudandenKassa />} />
      <Route path="/erbjudanden/boka" element={<ErbjudandenBoka />} />
      <Route path={WELLNESS_RECEIPT_PATH} element={<ErbjudandenKvitto />} />
      <Route
        path="/erbjudanden/kvitto"
        element={<PermanentRedirect to={WELLNESS_RECEIPT_PATH} />}
      />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

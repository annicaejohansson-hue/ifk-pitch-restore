import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getBookingUrl } from "@/lib/booking";
import {
  getVisitorType,
  setVisitorType as persistVisitorType,
  VISITOR_CHANGE_EVENT,
  type VisitorType,
} from "@/lib/visitor";

type VisitorContextValue = {
  visitorType: VisitorType;
  isIfkStocksund: boolean;
  bookingUrl: string;
  setVisitorType: (type: VisitorType) => void;
};

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitorType, setVisitorTypeState] = useState<VisitorType>(() =>
    typeof window === "undefined" ? "general" : getVisitorType(),
  );

  const setVisitorType = useCallback((type: VisitorType) => {
    persistVisitorType(type);
    setVisitorTypeState(type);
  }, []);

  useEffect(() => {
    const sync = () => setVisitorTypeState(getVisitorType());
    window.addEventListener(VISITOR_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(VISITOR_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const value = useMemo<VisitorContextValue>(
    () => ({
      visitorType,
      isIfkStocksund: visitorType === "ifk-stocksund",
      bookingUrl: getBookingUrl(visitorType),
      setVisitorType,
    }),
    [visitorType, setVisitorType],
  );

  return (
    <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
  );
}

export function useVisitor(): VisitorContextValue {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitor must be used within a VisitorProvider");
  }
  return context;
}

export function useBookingUrl(): string {
  return useVisitor().bookingUrl;
}
